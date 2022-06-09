import { Fetcher, Route, Token } from '@librax/sdk';

import { Configuration } from './config';
import { ContractName, TokenStat, AllocationTime, LPStat, Bank, PoolStats, LShareSwapperStat } from './types';
import { BigNumber, Contract, ethers, EventFilter } from 'ethers';
import { decimalToBalance } from './ether-utils';
import { TransactionResponse } from '@ethersproject/providers';
import ERC20 from './ERC20';
import { getFullDisplayBalance, getDisplayBalance } from '../utils/formatBalance';
import { getDefaultProvider } from '../utils/provider';
import IUniswapV2PairABI from './IUniswapV2Pair.abi.json';
import config, { bankDefinitions } from '../config';
import moment from 'moment';
import { parseUnits } from 'ethers/lib/utils';
import { ASTR_TICKER, SPOOKY_ROUTER_ADDR, LIBRA_TICKER } from '../utils/constants';
/**
 * An API module of Libra Finance contracts.
 * All contract-interacting domain logic should be defined in here.
 */
export class LibraFinance {
  myAccount: string;
  provider: ethers.providers.Web3Provider;
  signer?: ethers.Signer;
  config: Configuration;
  contracts: { [name: string]: Contract };
  externalTokens: { [name: string]: ERC20 };
  boardroomVersionOfUser?: string;

  LIBRAWASTR_LP: Contract;
  LIBRA: ERC20;
  LSHARE: ERC20;
  LBOND: ERC20;
  ASTR_USDC_LP_LIBRAX: ERC20;
  USDC: ERC20;
  ASTR: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      if (name == 'LShare') {
        console.log('LibraFinance: deployment.name = ', name);
        console.log('LibraFinance: deployment.address = ', deployment.address);
        console.log('LibraFinance: deployment.abi = ', deployment.abi);
      }

      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    this.LIBRA = new ERC20(deployments.libra.address, provider, 'LIBRA');
    this.LSHARE = new ERC20(deployments.LShare.address, provider, 'LSHARE');
    this.LBOND = new ERC20(deployments.LBond.address, provider, 'LBOND');
    this.ASTR_USDC_LP_LIBRAX = new ERC20(
      '0x139B81e5728026FAA8d7Ef6C79bb07f4d912641B',
      provider,
      'WASTR-USDC-LP-LIBRAX',
    );
    this.USDC = new ERC20('0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', provider, 'USDC');
    this.ASTR = this.externalTokens['WASTR'];

    // Uniswap V2 Pair
    this.LIBRAWASTR_LP = new Contract(externalTokens['LIBRA-WASTR-LP'][0], IUniswapV2PairABI, provider);

    this.config = cfg;
    this.provider = provider;
  }

  /**
   * @param provider From an unlocked wallet. (e.g. Metamask)
   * @param account An address of unlocked wallet account.
   */
  unlockWallet(provider: any, account: string) {
    const newProvider = new ethers.providers.Web3Provider(provider, this.config.chainId);
    this.signer = newProvider.getSigner(0);
    this.myAccount = account;
    for (const [name, contract] of Object.entries(this.contracts)) {
      this.contracts[name] = contract.connect(this.signer);
    }
    const tokens = [this.LIBRA, this.LSHARE, this.LBOND, ...Object.values(this.externalTokens)];
    for (const token of tokens) {
      token.connect(this.signer);
    }
    this.LIBRAWASTR_LP = this.LIBRAWASTR_LP.connect(this.signer);
    console.log(`🔓 Wallet is unlocked. Welcome, ${account}!`);
    this.fetchBoardroomVersionOfUser()
      .then((version) => (this.boardroomVersionOfUser = version))
      .catch((err) => {
        console.error(`Failed to fetch boardroom version: ${err.stack}`);
        this.boardroomVersionOfUser = 'latest';
      });
  }

  get isUnlocked(): boolean {
    return !!this.myAccount;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //===================FROM SPOOKY TO DISPLAY =========================
  //=========================IN HOME PAGE==============================
  //===================================================================

  async getLibraStat(): Promise<TokenStat> {
    const { LibraRewardPool } = this.contracts;
    const supply = await this.LIBRA.totalSupply();
    const libraRewardPoolSupply = await this.LIBRA.balanceOf(LibraRewardPool.address);
    const priceOfOneASTR = await this.getWASTRPriceFromArthswapASTRUSDC();
    const priceInASTR = await this.getLibraPriceFromLibraAstr();
    const priceOfLibraInDollars = (Number(priceInASTR) * Number(priceOfOneASTR)).toFixed(2);
    return {
      tokenInAstar: priceInASTR,
      priceInDollars: priceOfLibraInDollars,
      totalSupply: getDisplayBalance(supply, this.LIBRA.decimal, 0),
      circulatingSupply: getDisplayBalance(supply, this.LIBRA.decimal, 0),
    };
  }

  /**
   * Calculates various stats for the requested LP
   * @param name of the LP token to load stats for
   * @returns
   */
  async getLPStat(name: string): Promise<LPStat> {
    const lpToken = this.externalTokens[name];
    const lpTokenSupplyBN = await lpToken.totalSupply();
    const lpTokenSupply = getDisplayBalance(lpTokenSupplyBN, 18);
    const token0 = name.startsWith('LIBRA') ? this.LIBRA : this.LSHARE;
    const isLibra = name.startsWith('LIBRA');
    const tokenAmountBN = await token0.balanceOf(lpToken.address);
    const tokenAmount = getDisplayBalance(tokenAmountBN, 18);

    const astarAmountBN = await this.ASTR.balanceOf(lpToken.address);
    const astarAmount = getDisplayBalance(astarAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const astarAmountInOneLP = Number(astarAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isLibra);
    const lpTokenPriceFixed = Number(lpTokenPrice).toFixed(2).toString();
    const liquidity = (Number(lpTokenSupply) * Number(lpTokenPrice)).toFixed(2).toString();
    return {
      tokenAmount: tokenAmountInOneLP.toFixed(2).toString(),
      astarAmount: astarAmountInOneLP.toFixed(2).toString(),
      priceOfOne: lpTokenPriceFixed,
      totalLiquidity: liquidity,
      totalSupply: Number(lpTokenSupply).toFixed(2).toString(),
    };
  }

  /**
   * Use this method to get price for Libra
   * @returns TokenStat for LBOND
   * priceInASTR
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getBondStat(): Promise<TokenStat> {
    const { Treasury } = this.contracts;
    const libraStat = await this.getLibraStat();
    const bondLibraRatioBN = await Treasury.getBondPremiumRate();
    const modifier = bondLibraRatioBN / 1e18 > 1 ? bondLibraRatioBN / 1e18 : 1;
    const bondpriceInASTR = (Number(libraStat.tokenInAstar) * modifier).toFixed(2);
    const priceOfLBondInDollars = (Number(libraStat.priceInDollars) * modifier).toFixed(2);
    const supply = await this.LBOND.displayedTotalSupply();
    return {
      tokenInAstar: bondpriceInASTR,
      priceInDollars: priceOfLBondInDollars,
      totalSupply: supply,
      circulatingSupply: supply,
    };
  }

  /**
   * @returns TokenStat for LSHARE
   * priceInASTR
   * priceInDollars
   * TotalSupply
   * CirculatingSupply (always equal to total supply for bonds)
   */
  async getShareStat(): Promise<TokenStat> {
    const supply = await this.LSHARE.totalSupply();
    const { LibraAstarLPLShareRewardPool } = this.contracts;
    const priceInASTR = await this.getLSharePrice();
    const libraRewardPoolSupply = await this.LSHARE.balanceOf(LibraAstarLPLShareRewardPool.address);
    const lShareCirculatingSupply = supply.sub(libraRewardPoolSupply);
    const astarPriceInUSDC = await this.getWASTRPriceFromArthswapASTRUSDC();
    const priceOfSharesInDollars = (Number(priceInASTR) * Number(astarPriceInUSDC)).toFixed(2);

    return {
      tokenInAstar: priceInASTR,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.LSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(lShareCirculatingSupply, this.LSHARE.decimal, 0),
    };
  }

  async getLibraStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, LibraRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.LIBRA.address, ethers.utils.parseEther('1'));

    const supply = await this.LIBRA.totalSupply();
    const libraRewardPoolSupply = await this.LIBRA.balanceOf(LibraRewardPool.address);
    const libraCirculatingSupply = supply.sub(libraRewardPoolSupply);
    return {
      tokenInAstar: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.LIBRA.decimal, 0),
      circulatingSupply: getDisplayBalance(libraCirculatingSupply, this.LIBRA.decimal, 0),
    };
  }

  async getLibraPriceInLastTWAP(): Promise<BigNumber> {
    console.log('getLibraPriceInLastTWAP... this.contracts => ', this.contracts);
    const { Treasury } = this.contracts;
    console.log('getLibraPriceInLastTWAP... ');
    return Treasury.getLibraUpdatedPrice();
  }

  async getBondsPurchasable(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBurnableLibraLeft();
  }

  /**
   * Calculates the TVL, APR and daily APR of a provided pool/bank
   * @param bank
   * @returns
   */
  async getPoolAPRs(bank: Bank): Promise<PoolStats> {
    console.log('getPoolAPRs....');
    if (this.myAccount === undefined) return;
    console.log('getPoolAPRs.......');
    const depositToken = bank.depositToken;
    console.log('getPoolAPRs........');
    const poolContract = this.contracts[bank.contract];
    console.log('getPoolAPRs.........');
    // CHECK......!
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    console.log('getPoolAPRs..........depositTokenPrice.bank.depositTokenName=', bank.depositTokenName);
    console.log('getPoolAPRs..........depositTokenPrice.depositToken=', depositToken);

    const stakeInPool = await depositToken.balanceOf(bank.address);
    console.log('getPoolAPRs...........');
    // CHECK..
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));

    console.log('getPoolAPRs............TVL=', TVL);
    console.log('getPoolAPRs............TVL.stakeInPool=', stakeInPool.toString());
    console.log('getPoolAPRs............TVL=.depositToken.decimal', depositToken.decimal);
    console.log('getPoolAPRs............TVL=.depositTokenPrice', depositTokenPrice.toString());
    // 133 => 0.665 =>
    // 24 => 0.12

    const stat = bank.earnTokenName === 'LIBRA' ? await this.getLibraStat() : await this.getShareStat();
    console.log('getPoolAPRs.............');
    const totalAllocPoint = await poolContract.totalAllocPoint();
    const poolinfo = await poolContract.poolInfo(bank.poolId);
    let rewardPerSecond = BigNumber.from(0);
    let poolRewardPerSecond = BigNumber.from(0);
    if (bank.earnTokenName === 'LIBRA') {
      if (bank.contract.endsWith('LibraRewardPool')) {
        // LibraRewardPool
        const utime = Math.floor(Date.now() / 1000);
        const first = await poolContract.epochEndTimes(0);
        const second = await poolContract.epochEndTimes(1);
        const emission1 = await poolContract.epochLibraPerSecond(0);
        const emission2 = await poolContract.epochLibraPerSecond(1);
        if (utime <= first) {
          rewardPerSecond = emission1;
        } else if (utime <= second) {
          rewardPerSecond = emission2;
        } else {
          rewardPerSecond = BigNumber.from(0);
        }
        poolRewardPerSecond = rewardPerSecond.mul(poolinfo['allocPoint']).div(totalAllocPoint);
      } else {
        // GenesisPool
        rewardPerSecond = await poolContract.libraPerSecond();
        poolRewardPerSecond = rewardPerSecond.mul(poolinfo['allocPoint']).div(totalAllocPoint);
      }
    } else {
      // LShareRewardPool
      // TODO
      rewardPerSecond = await poolContract.lSharePerSecond();
      console.log('getPoolAPRs..............bank.poolId=', bank.poolId);
      console.log('getPoolAPRs..............poolContract.address=', poolContract.address);
      console.log('getPoolAPRs...........lSharePerSecond', rewardPerSecond.toString());

      const totalAllocApoint = await poolContract.totalAllocPoint();
      poolRewardPerSecond = rewardPerSecond.mul(poolinfo['allocPoint']).div(totalAllocApoint);

      // if (bank.depositTokenName.startsWith('LIBRA')) {
      //   poolRewardPerSecond = rewardPerSecond.mul(27300).div(45500);
      // } else {
      //   poolRewardPerSecond = rewardPerSecond.mul(18200).div(45500);
      // }
    }

    console.log('getPoolAPRs.............rewardPerSecond=', rewardPerSecond.toString());
    console.log('getPoolAPRs.............totalAllocPoint=', totalAllocPoint.toString());
    console.log('getPoolAPRs.............poolRewardPerSecond=', poolRewardPerSecond.toString());
    console.log('getPoolAPRs.............poolContract.address=', poolContract.address);

    // 1日排出
    const poolRewardPerDay = poolRewardPerSecond.mul(3600).mul(24);
    // 年間
    const poolRewardPerYear = poolRewardPerDay.mul(365);
    //  トークン価格
    const price = stat.priceInDollars;
    // APR

    const blockscouturl = 'https://blockscout.com/astar/address/' + poolContract.address;
    // console.log('getPoolAPRs.............libraPerSecond=', libraPerSecond.toString());
    console.log('getPoolAPRs.............contract bank.contract=', bank.contract);
    console.log('getPoolAPRs.............contract blockscouturl=', blockscouturl);
    console.log('getPoolAPRs.............TVL=', TVL);

    const dailyAPR = Number(getDisplayBalance(poolRewardPerDay, 18)) * Number(price);
    const yearlyAPR = Number(getDisplayBalance(poolRewardPerYear, 18)) * Number(price);

    // console.log('getPoolAPRs.............poolRewardPerSecond=', poolRewardPerSecond.toString());
    // console.log('getPoolAPRs.............poolRewardPerSecond=', poolRewardPerSecond.toString());
    // console.log('getPoolAPRs.............poolRewardPerSecond=', poolRewardPerSecond.toString());

    // const tokenPerSecond = await this.getTokenPerSecond(
    //   bank.earnTokenName,
    //   bank.contract,
    //   poolContract,
    //   bank.depositTokenName,
    // // );

    // console.log('getPoolAPRs.tokenPerSecond=', poolRewardPerSecond.toString());
    // console.log('getPoolAPRs stat.priceInDollars=', stat.priceInDollars);
    // const tokenPerHour = poolRewardPerSecond.mul(60).mul(60);
    // const totalRewardPricePerYear =
    //   Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    // const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    // const totalStakingTokenInPool =
    //   Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    // console.log('getPoolAPRs.stat.priceInDollars=', stat.priceInDollars);
    // console.log('getPoolAPRs.totalRewardPricePerDay=', totalRewardPricePerDay);
    // console.log(
    //   'getPoolAPRs.totalRewardPricePerYear.toFixed(2).toString()=',
    //   totalRewardPricePerYear.toFixed(2).toString(),
    // );
    // console.log(
    //   'getPoolAPRs.totalRewardPricePerDay.toFixed(2).toString()=',
    //   totalRewardPricePerDay.toFixed(2).toString(),
    // );
    // console.log('getPoolAPRs.totalRewardPricePerYear=', totalRewardPricePerYear);
    // console.log('getPoolAPRs.totalRewardPriTVLcePerYear=', TVL.toString());
    // const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    // const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    // return {
    //   dailyAPR: dailyAPR.toFixed(2).toString(),
    //   yearlyAPR: yearlyAPR.toFixed(2).toString(),
    //   TVL: TVL.toFixed(2).toString(),
    // };
    return {
      dailyAPR: dailyAPR.toString(),
      yearlyAPR: yearlyAPR.toString(),
      TVL: TVL.toString(),
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */

  // async getTokenPerSecond(
  //   earnTokenName: string,
  //   contractName: string,
  //   poolContract: Contract,
  //   depositTokenName: string,
  // ) {
  //   if (earnTokenName === 'LIBRA') {
  //     if (!contractName.endsWith('LibraRewardPool')) {
  //       const rewardPerSecond = await poolContract.libraPerSecond();
  //       if (depositTokenName === 'WASTR') {
  //         return rewardPerSecond.mul(6000).div(11000).div(24);
  //       } else if (depositTokenName === 'USDC') {
  //         return rewardPerSecond.mul(1000).div(11000).div(24);
  //       } else if (depositTokenName === 'JPYC') {
  //         return rewardPerSecond.mul(1500).div(11000).div(24);
  //       } else if (depositTokenName === 'ASTR-USDC-LP-LIBRAX') {
  //         return rewardPerSecond.mul(2500).div(11000).div(24);
  //       }
  //       return rewardPerSecond.div(24);
  //     }
  //     const poolStartTime = await poolContract.poolStartTime();
  //     const startDateTime = new Date(poolStartTime.toNumber() * 1000);
  //     const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
  //     if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
  //       return await poolContract.epochLibraPerSecond(1);
  //     }
  //     return await poolContract.epochLibraPerSecond(0);
  //   }
  //   const rewardPerSecond = await poolContract.lSharePerSecond();
  //   if (depositTokenName.startsWith('LIBRA')) {
  //     return rewardPerSecond.mul(27300).div(45500);
  //   } else {
  //     return rewardPerSecond.mul(18200).div(45500);
  //   }
  // }

  /**
   * Method to calculate the tokenPrice of the deposited asset in a pool/bank
   * If the deposited token is an LP it will find the price of its pieces
   * @param tokenName
   * @param pool
   * @param token
   * @returns
   */
  async getDepositTokenPriceInDollars(tokenName: string, token: ERC20) {
    let tokenPrice;
    const priceOfOneAstarInDollars = await this.getWASTRPriceFromArthswapASTRUSDC();
    if (tokenName === 'WASTR') {
      tokenPrice = priceOfOneAstarInDollars;
    } else {
      if (tokenName === 'LIBRA-WASTR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LIBRA, true);
      } else if (tokenName === 'LSHARE-WASTR-LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LSHARE, false);
      } else if (tokenName === 'WASTR-USDC-LP-LIBRAX') {
        // tokenPrice=1;
        //これで、LPに入っているUSDC*2が取得できる。 6 decimals
        const a = (await this.USDC.balanceOf(token.address)).mul(2);
        // console.log("getDepositTokenPriceInDollars: token.address=",token.address)
        // console.log("getDepositTokenPriceInDollars: this.USDC.address=",this.USDC.address)
        // console.log("getDepositTokenPriceInDollars: a=",a.toString())
        // console.log("getDepositTokenPriceInDollars:  (await this.USDC.balanceOf(token.address)=", (await this.USDC.balanceOf(token.address)) .toString())
        tokenPrice = (a.toNumber() / 1000000).toString();
      } else {
        tokenPrice = await this.getTokenPriceFromLP(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneAstarInDollars)).toString();
      }
    }
    console.log('getDepositTokenPriceInDollars: ', tokenPrice);
    return tokenPrice;
  }

  //===================================================================
  //===================== GET ASSET STATS =============================
  //=========================== END ===================================
  //===================================================================

  async getCurrentEpoch(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.epoch();
  }

  async getBondOraclePriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
    return Treasury.getBondPremiumRate();
  }

  /**
   * Buy bonds with cash.
   * @param amount amount of cash to purchase bonds with.
   */
  async buyBonds(amount: string | number): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const treasuryLibraPrice = await Treasury.getLibraPrice();
    return await Treasury.buyBonds(decimalToBalance(amount), treasuryLibraPrice);
  }

  /**
   * Redeem bonds for cash.
   * @param amount amount of bonds to redeem.
   */
  async redeemBonds(amount: string): Promise<TransactionResponse> {
    const { Treasury } = this.contracts;
    const priceForLibra = await Treasury.getLibraPrice();
    return await Treasury.redeemBonds(decimalToBalance(amount), priceForLibra);
  }

  async getTotalValueLocked(): Promise<Number> {
    let totalValue = 0;
    for (const bankInfo of Object.values(bankDefinitions)) {
      const pool = this.contracts[bankInfo.contract];
      const token = this.externalTokens[bankInfo.depositTokenName];
      const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
      const tokenAmountInPool = await token.balanceOf(pool.address);
      const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
      const poolValue = Number.isNaN(value) ? 0 : value;
      totalValue += poolValue;
    }
    const LSHAREPrice = (await this.getShareStat()).priceInDollars;
    const boardroomlShareBalanceOf = await this.LSHARE.balanceOf(this.currentBoardroom().address);
    const boardroomTVL = Number(getDisplayBalance(boardroomlShareBalanceOf, this.LSHARE.decimal)) * Number(LSHAREPrice);

    return totalValue + boardroomTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be ASTR in most cases)
   * @param isLibra sanity check for usage of libra token or lShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isLibra: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat = isLibra === true ? await this.getLibraStat() : await this.getShareStat();
    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  async earnedFromBank(
    poolName: ContractName,
    earnTokenName: String,
    poolId: Number,
    account = this.myAccount,
  ): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      if (earnTokenName === 'LIBRA') {
        return await pool.pendingLIBRA(poolId, account);
      } else {
        return await pool.pendingShare(poolId, account);
      }
    } catch (err) {
      console.error(`Failed to call earned() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err}`);
      return BigNumber.from(0);
    }
  }

  /**
   * Deposits token to given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async stake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    // return await pool.deposit(poolId, amount);
    const gas = await pool.estimateGas.deposit(poolId, amount);
    return await pool.deposit(poolId, amount, { gasLimit: gas.mul(5).toString() });
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    // return await pool.withdraw(poolId, amount);
    const gas = await pool.estimateGas.withdraw(poolId, amount);
    return await pool.withdraw(poolId, amount, { gasLimit: gas.mul(5).toString() });
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    // return await pool.withdraw(poolId, 0);
    const gas = await pool.estimateGas.withdraw(poolId, 0);
    return await pool.withdraw(poolId, 0, { gasLimit: gas.mul(5).toString() });
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    // return await pool.withdraw(poolId, userInfo.amount);
    const gas = await pool.estimateGas.withdraw(poolId, userInfo.amount);
    return await pool.withdraw(poolId, userInfo.amount, { gasLimit: gas.mul(5).toString() });
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      throw new Error('you must unlock the wallet to continue.');
    }
    return this.contracts.Boardroom;
  }

  isOldBoardroomMember(): boolean {
    return this.boardroomVersionOfUser !== 'latest';
  }

  async getTokenPriceFromLP(tokenContract: ERC20): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { chainId } = this.config;
    const { WASTR } = this.config.externalTokens;
    const wastr = new Token(chainId, WASTR[0], WASTR[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    console.log('@@@@@@@wastr ', wastr);
    console.log('@@@@@@@token ', token);
    console.log('@@@@@@@this.provider ', wastr);
    try {
      const wastrToToken = await Fetcher.fetchPairData(wastr, token, this.provider);
      const priceInUSDC = new Route([wastrToToken], token);
      return priceInUSDC.midPrice.toFixed(4);
      // return priceInUSDC.midPrice.toFixed(8);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  async getLSharePrice(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WASTR, LSHARE } = this.externalTokens;
    const lshare_astr_lp_pair = this.externalTokens['LSHARE-WASTR-LP'];

    let astr_amount_BN = await WASTR.balanceOf(lshare_astr_lp_pair.address);
    let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
    let LSHARE_amount_BN = await LSHARE.balanceOf(lshare_astr_lp_pair.address);
    let LSHARE_amount = Number(getFullDisplayBalance(LSHARE_amount_BN, lshare_astr_lp_pair.decimal));
    return (astr_amount / LSHARE_amount).toString();
  }
  async getLibraPriceFromLibraAstr(): Promise<string> {
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WASTR, LIBRA } = this.externalTokens;
    const libra_astr_lp_pair = this.externalTokens['LIBRA-WASTR-LP'];
    let astr_amount_BN = await WASTR.balanceOf(libra_astr_lp_pair.address);
    let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
    let LIBRA_amount_BN = await LIBRA.balanceOf(libra_astr_lp_pair.address);
    let LIBRA_amount = Number(getFullDisplayBalance(LIBRA_amount_BN, libra_astr_lp_pair.decimal));
    return (astr_amount / LIBRA_amount).toString();
  }

  // const [ASTRPrice, setASTRPrice] = useState("");
  // const [isWalletProviderOpen, setWalletProviderOpen] = useState(false);

  // let astarPriceOnArthswap = 0;
  async getWASTRPriceFromArthswapASTRUSDC(): Promise<string> {
    console.log('getWASTRPriceFromArthswapASTRUSDC....');
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WASTR, USDC } = this.externalTokens;
    try {
      // console.log('getWASTRPriceFromArthswapASTRUSDC....0');
      const astr_usdc_lp_pair = this.externalTokens['ASTR-USDC-LP'];
      // console.log('getWASTRPriceFromArthswapASTRUSDC....1');
      // console.log('getWASTRPriceFromArthswapASTRUSDC....1 astr_usdc_lp_pair.address=', astr_usdc_lp_pair.address);
      let astr_amount_BN = await WASTR.balanceOf(astr_usdc_lp_pair.address);
      // console.log('getWASTRPriceFromArthswapASTRUSDC....2');
      // console.log('getWASTRPriceFromArthswapASTRUSDC....2 WASTR.decimal=', WASTR.decimal);
      // console.log('getWASTRPriceFromArthswapASTRUSDC....2 astr_amount_BN=', astr_amount_BN.toString());
      let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
      // console.log('getWASTRPriceFromArthswapASTRUSDC....3');
      // console.log('getWASTRPriceFromArthswapASTRUSDC....3');
      let USDC_amount_BN = await USDC.balanceOf(astr_usdc_lp_pair.address);
      // console.log('getWASTRPriceFromArthswapASTRUSDC....4');
      // console.log('getWASTRPriceFromArthswapASTRUSDC....4');
      // console.log('getWASTRPriceFromArthswapASTRUSDC....4 USDC_amount_BN=', USDC_amount_BN.toString());
      // console.log('getWASTRPriceFromArthswapASTRUSDC....4 USDC.decimal=', USDC.decimal);
      let USDC_amount = Number(getFullDisplayBalance(USDC_amount_BN, USDC.decimal));
      // console.log('getWASTRPriceFromArthswapASTRUSDC....5 USDC_amount=', USDC_amount);
      // console.log('getWASTRPriceFromArthswapASTRUSDC....5 astr_amount=', astr_amount);

      //雑計算。流動性がたっぷりある時だけの雑計算。
      const tmp = (
        parseInt(USDC_amount_BN.div('1000000').toString()) /
        parseInt(astr_amount_BN.div(BigNumber.from('1000000000000000000')).toString())
      ).toString();

      return tmp;

      // return (USDC_amount / astr_amount).toString();
    } catch (err) {
      console.error(`Failed to fetch token price of WASTR: ${err}`);
    }
  }

  //===================================================================
  //===================================================================
  //===================== BOARDROOM METHODS =============================
  //===================================================================
  //===================================================================

  async getBoardroomAPR() {
    const Boardroom = this.currentBoardroom();
    const latestSnapshotIndex = await Boardroom.latestSnapshotIndex();
    const lastHistory = await Boardroom.boardroomHistory(latestSnapshotIndex);

    const lastRewardsReceived = lastHistory[1];

    const LSHAREPrice = (await this.getShareStat()).priceInDollars;
    console.log('const LSHAREPrice = (await this.getShareStat()).priceInDollars');
    const LIBRAPrice = (await this.getLibraStat()).priceInDollars;
    const epochRewardsPerShare = lastRewardsReceived / 1e18;

    //Mgod formula
    const amountOfRewardsPerDay = epochRewardsPerShare * Number(LIBRAPrice) * 4;
    const boardroomlShareBalanceOf = await this.LSHARE.balanceOf(Boardroom.address);
    const boardroomTVL = Number(getDisplayBalance(boardroomlShareBalanceOf, this.LSHARE.decimal)) * Number(LSHAREPrice);
    const realAPR = ((amountOfRewardsPerDay * 100) / boardroomTVL) * 365;
    return realAPR;
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserClaimRewardFromBoardroom(): Promise<boolean> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.canClaimReward(this.myAccount);
  }

  /**
   * Checks if the user is allowed to retrieve their reward from the Boardroom
   * @returns true if user can withdraw reward, false if they can't
   */
  async canUserUnstakeFromBoardroom(): Promise<boolean> {
    const Boardroom = this.currentBoardroom();
    const canWithdraw = await Boardroom.canWithdraw(this.myAccount);
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    const notStaked = Number(getDisplayBalance(stakedAmount, this.LSHARE.decimal)) === 0;
    const result = notStaked ? true : canWithdraw;
    return result;
  }

  async timeUntilClaimRewardFromBoardroom(): Promise<BigNumber> {
    // const Boardroom = this.currentBoardroom();
    // const mason = await Boardroom.masons(this.myAccount);
    return BigNumber.from(0);
    // const Boardroom = this.currentBoardroom();
    // const mason = await Boardroom.members(this.myAccount);
    // return mason['']
  }

  async getTotalStakedInBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.totalSupply();
  }

  async stakeShareToBoardroom(amount: string): Promise<TransactionResponse> {
    if (this.isOldBoardroomMember()) {
      throw new Error("you're using old boardroom. please withdraw and deposit the LSHARE again.");
    }
    const Boardroom = this.currentBoardroom();
    return await Boardroom.stake(decimalToBalance(amount));
  }

  async getStakedSharesOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getShareOf(this.myAccount);
    }
    return await Boardroom.balanceOf(this.myAccount);
  }

  async getEarningsOnBoardroom(): Promise<BigNumber> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.getCashEarningsOf(this.myAccount);
    }
    return await Boardroom.earned(this.myAccount);
  }

  async withdrawShareFromBoardroom(amount: string): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.withdraw(decimalToBalance(amount));
  }

  async harvestCashFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    if (this.boardroomVersionOfUser === 'v1') {
      return await Boardroom.claimDividends();
    }
    return await Boardroom.claimReward();
  }

  async exitFromBoardroom(): Promise<TransactionResponse> {
    const Boardroom = this.currentBoardroom();
    return await Boardroom.exit();
  }

  async getTreasuryNextAllocationTime(): Promise<AllocationTime> {
    const { Treasury } = this.contracts;
    const nextEpochTimestamp: BigNumber = await Treasury.nextEpochPoint();
    const nextAllocation = new Date(nextEpochTimestamp.mul(1000).toNumber());
    const prevAllocation = new Date(Date.now());

    return { from: prevAllocation, to: nextAllocation };
  }
  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to claim
   * their reward from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserClaimRewardTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const nextEpochTimestamp = await Boardroom.nextEpochPoint(); //in unix timestamp
    const currentEpoch = await Boardroom.epoch();
    // const mason = await Boardroom.masons(this.myAccount);
    const mason = await Boardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const periodInHours = period / 60 / 60; // 6 hours, period is displayed in seconds which is 21600
    const rewardLockupEpochs = await Boardroom.rewardLockupEpochs();
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(rewardLockupEpochs);

    const fromDate = new Date(Date.now());
    if (targetEpochForClaimUnlock - currentEpoch <= 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - currentEpoch - 1;
      const endDate = moment(toDate)
        .add(delta * periodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  /**
   * This method calculates and returns in a from to to format
   * the period the user needs to wait before being allowed to unstake
   * from the boardroom
   * @returns Promise<AllocationTime>
   */
  async getUserUnstakeTime(): Promise<AllocationTime> {
    const { Boardroom, Treasury } = this.contracts;
    const nextEpochTimestamp = await Boardroom.nextEpochPoint();
    const currentEpoch = await Boardroom.epoch();
    // const mason = await Boardroom.masons(this.myAccount);
    const mason = await Boardroom.members(this.myAccount);
    const startTimeEpoch = mason.epochTimerStart;
    const period = await Treasury.PERIOD();
    const PeriodInHours = period / 60 / 60;
    const withdrawLockupEpochs = await Boardroom.withdrawLockupEpochs();
    const fromDate = new Date(Date.now());
    const targetEpochForClaimUnlock = Number(startTimeEpoch) + Number(withdrawLockupEpochs);
    const stakedAmount = await this.getStakedSharesOnBoardroom();
    if (currentEpoch <= targetEpochForClaimUnlock && Number(stakedAmount) === 0) {
      return { from: fromDate, to: fromDate };
    } else if (targetEpochForClaimUnlock - currentEpoch === 1) {
      const toDate = new Date(nextEpochTimestamp * 1000);
      return { from: fromDate, to: toDate };
    } else {
      const toDate = new Date(nextEpochTimestamp * 1000);
      const delta = targetEpochForClaimUnlock - Number(currentEpoch) - 1;
      const endDate = moment(toDate)
        .add(delta * PeriodInHours, 'hours')
        .toDate();
      return { from: fromDate, to: endDate };
    }
  }

  async watchAssetInMetamask(assetName: string): Promise<boolean> {
    const { ethereum } = window as any;
    if (ethereum && ethereum.networkVersion === config.chainId.toString()) {
      let asset;
      let assetUrl;
      if (assetName === 'LIBRA') {
        asset = this.LIBRA;
        assetUrl = 'https://libra.finance/presskit/libra_icon_noBG.png';
      } else if (assetName === 'LSHARE') {
        asset = this.LSHARE;
        assetUrl = 'https://libra.finance/presskit/lshare_icon_noBG.png';
      } else if (assetName === 'LBOND') {
        asset = this.LBOND;
        assetUrl = 'https://libra.finance/presskit/lbond_icon_noBG.png';
      }
      await ethereum.request({
        method: 'wallet_watchAsset',
        params: {
          type: 'ERC20',
          options: {
            address: asset.address,
            symbol: asset.symbol,
            decimals: 18,
            image: assetUrl,
          },
        },
      });
    }
    return true;
  }

  async provideLibraAstrLP(astarAmount: string, libraAmount: BigNumber): Promise<TransactionResponse> {
    const { TaxOffice } = this.contracts;
    let overrides = {
      value: parseUnits(astarAmount, 18),
    };
    return await TaxOffice.addLiquidityETHTaxFree(
      libraAmount,
      libraAmount.mul(992).div(1000),
      parseUnits(astarAmount, 18).mul(992).div(1000),
      overrides,
    );
  }

  async quoteFromSpooky(tokenAmount: string, tokenName: string): Promise<string> {
    const { LibraXRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.LIBRAWASTR_LP.getReserves();
    let quote;
    if (tokenName === 'LIBRA') {
      quote = await LibraXRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await LibraXRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
    }
    return (quote / 1e18).toString();
  }

  /**
   * @returns an array of the regulation events till the most up to date epoch
   */
  async listenForRegulationsEvents(): Promise<any> {
    const { Treasury } = this.contracts;

    const treasuryDaoFundedFilter = Treasury.filters.DaoFundFunded();
    const treasuryDevFundedFilter = Treasury.filters.DevFundFunded();
    const treasuryInsuranceFundedFilter = Treasury.filters.InsuranceFundFunded();
    const treasuryBoardroomFundedFilter = Treasury.filters.BoardroomFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    console.log('queryFilter..listenForRegulationsEvents....');
    console.log(
      'queryFilter..listenForRegulationsEvents....treasuryBoardroomFundedFilter=',
      treasuryBoardroomFundedFilter,
    );
    // now 1148764
    // start 1100000
    // latest 10000 => -10000
    console.log('listenForRegulationsEvents..............');
    let boardroomFundEvents = await Treasury.queryFilter(treasuryBoardroomFundedFilter, -10000);
    console.log('queryFilter.. listenForRegulationsEvents.........boardroomFundEvents=', boardroomFundEvents);
    var events: any[] = [];
    boardroomFundEvents.forEach(function callback(value, index) {
      events.push({ epoch: index + 1 });
      events[index].boardroomFund = getDisplayBalance(value.args[1]);
      if (index === 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
      }
      if (index > 0) {
        epochBlocksRanges.push({
          index: index,
          startBlock: value.blockNumber,
          boughBonds: 0,
          redeemedBonds: 0,
        });
        epochBlocksRanges[index - 1].endBlock = value.blockNumber;
      }
    });
    console.log('enForRegulationsEvents...................');
    epochBlocksRanges.forEach(async (value, index) => {
      events[index].bondsBought = await this.getBondsWithFilterForPeriod(
        boughtBondsFilter,
        value.startBlock,
        value.endBlock,
      );
      events[index].bondsRedeemed = await this.getBondsWithFilterForPeriod(
        redeemBondsFilter,
        value.startBlock,
        value.endBlock,
      );
    });

    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter, -10000);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });

    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter, -10000);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
    });

    let InsuranceFundEvents = await Treasury.queryFilter(treasuryInsuranceFundedFilter, -10000);
    InsuranceFundEvents.forEach(function callback(value, index) {
      events[index].insuranceFund = getDisplayBalance(value.args[1]);
    });

    return events;
  }

  /**
   * Helper method
   * @param filter applied on the query to the treasury events
   * @param from block number
   * @param to block number
   * @returns the amount of bonds events emitted based on the filter provided during a specific period
   */
  async getBondsWithFilterForPeriod(filter: EventFilter, from: number, to: number): Promise<number> {
    const { Treasury } = this.contracts;
    const bondsAmount = await Treasury.queryFilter(filter, from, to);
    return bondsAmount.length;
  }

  async estimateZapIn(tokenName: string, lpName: string, amount: string): Promise<number[]> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    let estimate;
    if (tokenName === ASTR_TICKER) {
      estimate = await zapper.estimateZapIn(lpToken.address, SPOOKY_ROUTER_ADDR, parseUnits(amount, 18));
    } else {
      const token = tokenName === LIBRA_TICKER ? this.LIBRA : this.LSHARE;
      estimate = await zapper.estimateZapInToken(
        token.address,
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        parseUnits(amount, 18),
      );
    }
    return [estimate[0] / 1e18, estimate[1] / 1e18];
  }
  async zapIn(tokenName: string, lpName: string, amount: string): Promise<TransactionResponse> {
    const { zapper } = this.contracts;
    const lpToken = this.externalTokens[lpName];
    if (tokenName === ASTR_TICKER) {
      let overrides = {
        value: parseUnits(amount, 18),
      };
      return await zapper.zapIn(lpToken.address, SPOOKY_ROUTER_ADDR, this.myAccount, overrides);
    } else {
      const token = tokenName === LIBRA_TICKER ? this.LIBRA : this.LSHARE;
      return await zapper.zapInToken(
        token.address,
        parseUnits(amount, 18),
        lpToken.address,
        SPOOKY_ROUTER_ADDR,
        this.myAccount,
      );
    }
  }
  async swapLBondToLShare(lbondAmount: BigNumber): Promise<TransactionResponse> {
    const { LShareSwapper } = this.contracts;
    return await LShareSwapper.swapLBondToLShare(lbondAmount);
  }
  async estimateAmountOfLShare(lbondAmount: string): Promise<string> {
    const { LShareSwapper } = this.contracts;
    try {
      const estimateBN = await LShareSwapper.estimateAmountOfLShare(parseUnits(lbondAmount, 18));
      return getDisplayBalance(estimateBN, 18, 6);
    } catch (err) {
      console.error(`Failed to fetch estimate lshare amount: ${err}`);
    }
  }

  async getLShareSwapperStat(address: string): Promise<LShareSwapperStat> {
    const { LShareSwapper } = this.contracts;
    const lshareBalanceBN = await LShareSwapper.getLShareBalance();
    const lbondBalanceBN = await LShareSwapper.getLBondBalance(address);
    // const libraPriceBN = await LShareSwapper.getLibraPrice();
    // const lsharePriceBN = await LShareSwapper.getLSharePrice();
    const rateLSharePerLibraBN = await LShareSwapper.getLShareAmountPerLibra();
    const lshareBalance = getDisplayBalance(lshareBalanceBN, 18, 5);
    const lbondBalance = getDisplayBalance(lbondBalanceBN, 18, 5);
    return {
      lshareBalance: lshareBalance.toString(),
      lbondBalance: lbondBalance.toString(),
      // libraPrice: libraPriceBN.toString(),
      // lsharePrice: lsharePriceBN.toString(),
      rateLSharePerLibra: rateLSharePerLibraBN.toString(),
    };
  }
}
