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
import { FTM_TICKER, SPOOKY_ROUTER_ADDR, LIBRA_TICKER } from '../utils/constants';
/**
 * An API module of 2omb Finance contracts.
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

  LIBRAWFTM_LP: Contract;
  LIBRA: ERC20;
  // LSHARE: ERC20;
  LSHARE: ERC20;
  LBOND: ERC20;
  FTM: ERC20;

  constructor(cfg: Configuration) {
    const { deployments, externalTokens } = cfg;
    const provider = getDefaultProvider();

    // loads contracts from deployments
    this.contracts = {};
    for (const [name, deployment] of Object.entries(deployments)) {
      this.contracts[name] = new Contract(deployment.address, deployment.abi, provider);
    }
    this.externalTokens = {};
    for (const [symbol, [address, decimal]] of Object.entries(externalTokens)) {
      this.externalTokens[symbol] = new ERC20(address, provider, symbol, decimal);
    }
    // this.LIBRA = new ERC20(deployments.libra.address, provider, 'LIBRA');
    this.LIBRA = new ERC20(deployments.libra.address, provider, 'LIBRA');
    this.LSHARE = new ERC20(deployments.LShare.address, provider, 'LSHARE');
    this.LBOND = new ERC20(deployments.LBond.address, provider, 'LBOND');
    // this.FTM = this.externalTokens['WFTM'];
    this.FTM = this.externalTokens['WASTR'];

    // Uniswap V2 Pair
    // this.LIBRAWFTM_LP = new Contract(externalTokens['LIBRA-FTM-LP'][0], IUniswapV2PairABI, provider);
    this.LIBRAWFTM_LP = new Contract(externalTokens['LIBRA-ASTR-LP'][0], IUniswapV2PairABI, provider);

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
    this.LIBRAWFTM_LP = this.LIBRAWFTM_LP.connect(this.signer);
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
    console.log('getLibraStat');
    console.log('getLibraStat:', this.LIBRA);
    const { LibraFtmRewardPool, LibraFtmLpLibraRewardPool, LibraFtmLpLibraRewardPoolOld } = this.contracts;
    console.log('getLibraStat:  LibraFtmLpLibraRewardPoolOld:', LibraFtmLpLibraRewardPoolOld);
    console.log('getLibraStat:  LibraFtmLpLibraRewardPool:', LibraFtmLpLibraRewardPool);
    console.log('getLibraStat:', this.LIBRA);
    const supply = await this.LIBRA.totalSupply();

    console.log('getLibraStat: supply: ', supply.toString());
    const libraRewardPoolSupply = await this.LIBRA.balanceOf(LibraFtmRewardPool.address);
    const libraRewardPoolSupply2 = await this.LIBRA.balanceOf(LibraFtmLpLibraRewardPool.address);
    // const libraRewardPoolSupplyOld = await this.LIBRA.balanceOf(LibraFtmLpLibraRewardPoolOld.address);

    const libraCirculatingSupply = supply.sub(libraRewardPoolSupply).sub(libraRewardPoolSupply2);
    // .sub(libraRewardPoolSupplyOld);
    console.log('getLibraStat: libraCirculatingSupply: ', libraCirculatingSupply);

    const priceOfOneASTR = await this.getWASTRPriceFromArthswapASTRUSDC();
    console.log('getLibraStat: priceOfOneASTR: ', priceOfOneASTR);
    const priceInASTR = await this.getLibraPriceFromLibraAstr();
    // const priceInASTR = await this.getTokenPriceFromLP(this.LIBRA);
    console.log('getLibraStat: price in astr :', priceInASTR);
    const priceOfLibraInDollars = (Number(priceInASTR) * Number(priceOfOneASTR)).toFixed(2);

    return {
      tokenInAstar: priceInASTR,
      priceInDollars: priceOfLibraInDollars,
      totalSupply: getDisplayBalance(supply, this.LIBRA.decimal, 0),
      circulatingSupply: getDisplayBalance(libraCirculatingSupply, this.LIBRA.decimal, 0),
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

    const astarAmountBN = await this.FTM.balanceOf(lpToken.address);
    const astarAmount = getDisplayBalance(astarAmountBN, 18);
    const tokenAmountInOneLP = Number(tokenAmount) / Number(lpTokenSupply);
    const astarAmountInOneLP = Number(astarAmount) / Number(lpTokenSupply);
    const lpTokenPrice = await this.getLPTokenPrice(lpToken, token0, isLibra, false);
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
    console.log('getShareStat ');

    console.log('getShareStat:', this.LSHARE);
    // const { LibraFtmRewardPool, LibraFtmLpLibraRewardPool, LibraFtmLpLibraRewardPoolOld } = this.contracts;
    // console.log('getShareStat:  LibraFtmLpLibraRewardPoolOld:', LibraFtmLpLibraRewardPoolOld);
    // console.log('getShareStat:  LibraFtmLpLibraRewardPool:', LibraFtmLpLibraRewardPool);
    // console.log('getShareStat:', this.LIBRA);
    const supply = await this.LSHARE.totalSupply();
    console.log('getShareStat:  supply= ' + supply.toString());

    const { LibraAstarLPLShareRewardPool } = this.contracts;

    console.log('getShareStat LibraAstarLPLShareRewardPool=', LibraAstarLPLShareRewardPool);
    // const supply = await this.LSHARE.totalSupply();
    // console.log('getShareStat supply=', supply);
    console.log('getShareStat LSHARE=', this.LSHARE);
    console.log('getShareStat LSHARE=', this.LSHARE.address);

    // const priceInASTR = await this.getTokenPriceFromLP(this.LSHARE);
    const priceInASTR = await this.getLSharePrice();

    console.log('getShareStat priceInASTR=', priceInASTR);
    const libraRewardPoolSupply = await this.LSHARE.balanceOf(LibraAstarLPLShareRewardPool.address);
    console.log('getShareStat libraRewardPoolSupply=', libraRewardPoolSupply);
    const lShareCirculatingSupply = supply.sub(libraRewardPoolSupply);
    console.log('getShareStat lShareCirculatingSupply=', lShareCirculatingSupply);
    const astarPriceInUSDC = await this.getWASTRPriceFromArthswapASTRUSDC();
    console.log('getShareStat astarPriceInUSDC=', astarPriceInUSDC);
    console.log('getShareStat priceInASTR=', priceInASTR);
    const priceOfSharesInDollars = (Number(priceInASTR) * Number(astarPriceInUSDC)).toFixed(2);
    console.log('getShareStat priceOfSharesInDollars=', priceOfSharesInDollars);

    return {
      tokenInAstar: priceInASTR,
      priceInDollars: priceOfSharesInDollars,
      totalSupply: getDisplayBalance(supply, this.LSHARE.decimal, 0),
      circulatingSupply: getDisplayBalance(lShareCirculatingSupply, this.LSHARE.decimal, 0),
    };
  }

  async getLibraStatInEstimatedTWAP(): Promise<TokenStat> {
    const { SeigniorageOracle, LibraFtmRewardPool } = this.contracts;
    const expectedPrice = await SeigniorageOracle.twap(this.LIBRA.address, ethers.utils.parseEther('1'));

    const supply = await this.LIBRA.totalSupply();
    const libraRewardPoolSupply = await this.LIBRA.balanceOf(LibraFtmRewardPool.address);
    const libraCirculatingSupply = supply.sub(libraRewardPoolSupply);
    return {
      tokenInAstar: getDisplayBalance(expectedPrice),
      priceInDollars: getDisplayBalance(expectedPrice),
      totalSupply: getDisplayBalance(supply, this.LIBRA.decimal, 0),
      circulatingSupply: getDisplayBalance(libraCirculatingSupply, this.LIBRA.decimal, 0),
    };
  }

  async getLibraPriceInLastTWAP(): Promise<BigNumber> {
    const { Treasury } = this.contracts;
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
    if (this.myAccount === undefined) return;
    const depositToken = bank.depositToken;
    const poolContract = this.contracts[bank.contract];
    const depositTokenPrice = await this.getDepositTokenPriceInDollars(bank.depositTokenName, depositToken);
    console.log('deposit token price:', depositTokenPrice);
    const stakeInPool = await depositToken.balanceOf(bank.address);
    const TVL = Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const stat = bank.earnTokenName === 'LIBRA' ? await this.getLibraStat() : await this.getShareStat();
    const tokenPerSecond = await this.getTokenPerSecond(
      bank.earnTokenName,
      bank.contract,
      poolContract,
      bank.depositTokenName,
    );

    const tokenPerHour = tokenPerSecond.mul(60).mul(60);
    const totalRewardPricePerYear =
      Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24).mul(365)));
    const totalRewardPricePerDay = Number(stat.priceInDollars) * Number(getDisplayBalance(tokenPerHour.mul(24)));
    const totalStakingTokenInPool =
      Number(depositTokenPrice) * Number(getDisplayBalance(stakeInPool, depositToken.decimal));
    const dailyAPR = (totalRewardPricePerDay / totalStakingTokenInPool) * 100;
    const yearlyAPR = (totalRewardPricePerYear / totalStakingTokenInPool) * 100;
    return {
      dailyAPR: dailyAPR.toFixed(2).toString(),
      yearlyAPR: yearlyAPR.toFixed(2).toString(),
      TVL: TVL.toFixed(2).toString(),
    };
  }

  /**
   * Method to return the amount of tokens the pool yields per second
   * @param earnTokenName the name of the token that the pool is earning
   * @param contractName the contract of the pool/bank
   * @param poolContract the actual contract of the pool
   * @returns
   */
  async getTokenPerSecond(
    earnTokenName: string,
    contractName: string,
    poolContract: Contract,
    depositTokenName: string,
  ) {
    if (earnTokenName === 'LIBRA') {
      if (!contractName.endsWith('LibraRewardPool')) {
        const rewardPerSecond = await poolContract.libraPerSecond();
        if (depositTokenName === '2SHARES') {
          return rewardPerSecond.mul(7500).div(25000).div(24).mul(20);
        } else if (depositTokenName === '2OMB') {
          return rewardPerSecond.mul(5000).div(25000).div(24).mul(20);
        } else if (depositTokenName === 'BELUGA') {
          return rewardPerSecond.mul(500).div(25000).div(24).mul(20);
        } else if (depositTokenName === 'BIFI') {
          return rewardPerSecond.mul(500).div(25000).div(24).mul(20);
        } else if (depositTokenName === 'WFTM') {
          return rewardPerSecond.mul(500).div(25000).div(24).mul(20);
        } else if (depositTokenName === '2OMB-WFTM LP') {
          return rewardPerSecond.mul(6000).div(25000).div(24).mul(20);
        } else if (depositTokenName === '2SHARES-WFTM LP') {
          return rewardPerSecond.mul(6000).div(25000).div(24).mul(20);
        } else if (depositTokenName === 'BLOOM') {
          return rewardPerSecond.mul(500).div(25000).div(24).mul(20);
        }
        return rewardPerSecond.div(24);
      }
      const poolStartTime = await poolContract.poolStartTime();
      const startDateTime = new Date(poolStartTime.toNumber() * 1000);
      const FOUR_DAYS = 4 * 24 * 60 * 60 * 1000;
      if (Date.now() - startDateTime.getTime() > FOUR_DAYS) {
        return await poolContract.epochLibraPerSecond(1);
      }
      return await poolContract.epochLibraPerSecond(0);
    }
    const rewardPerSecond = await poolContract.lSharePerSecond();
    if (depositTokenName.startsWith('LIBRA')) {
      return rewardPerSecond.mul(35500).div(89500);
    } else if (depositTokenName.startsWith('2OMB')) {
      return rewardPerSecond.mul(15000).div(89500);
    } else if (depositTokenName.startsWith('2SHARE')) {
      return rewardPerSecond.mul(15000).div(89500);
    } else {
      return rewardPerSecond.mul(24000).div(89500);
    }
  }

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
    const priceOfOneFtmInDollars = await this.getWASTRPriceFromArthswapASTRUSDC();
    if (tokenName === 'wFTM') {
      tokenPrice = priceOfOneFtmInDollars;
    } else {
      console.log('token name:', tokenName);
      if (tokenName === 'LIBRA-WASTR LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LIBRA, true, false);
      } else if (tokenName === 'LSHARE-WASTR LP') {
        tokenPrice = await this.getLPTokenPrice(token, this.LSHARE, false, false);
      } else if (tokenName === '2SHARES-WFTM LP') {
        tokenPrice = await this.getLPTokenPrice(
          token,
          new ERC20('0xc54a1684fd1bef1f077a336e6be4bd9a3096a6ca', this.provider, '2SHARES'),
          false,
          true,
        );
      } else if (tokenName === '2OMB-WFTM LP') {
        console.log('getting the LP token price here');
        tokenPrice = await this.getLPTokenPrice(
          token,
          new ERC20('0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae', this.provider, '2OMB'),
          true,
          true,
        );
        console.log('my token price:', tokenPrice);
        // } else if (tokenName === 'BLOOM') {
        //   tokenPrice = await this.getTokenPriceFromSpiritswap(token);
        // } else if (tokenName === 'BELUGA') {
        //   const data = await fetch('https://api.coingecko.com/api/v3/simple/price?ids=beluga-fi&vs_currencies=usd').then(
        //     (res) => res.json(),
        //   );
        //   tokenPrice = data['beluga-fi'].usd;
      } else {
        tokenPrice = await this.getTokenPriceFromLP(token);
        tokenPrice = (Number(tokenPrice) * Number(priceOfOneFtmInDollars)).toString();
      }
    }
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
    // for (const bankInfo of Object.values(bankDefinitions)) {
    //   const pool = this.contracts[bankInfo.contract];
    //   const token = this.externalTokens[bankInfo.depositTokenName];
    //   const tokenPrice = await this.getDepositTokenPriceInDollars(bankInfo.depositTokenName, token);
    //   const tokenAmountInPool = await token.balanceOf(pool.address);
    //   const value = Number(getDisplayBalance(tokenAmountInPool, token.decimal)) * Number(tokenPrice);
    //   const poolValue = Number.isNaN(value) ? 0 : value;
    //   totalValue += poolValue;
    // }
    let boardroomTVL = 0;
    // const LSHAREPrice = (await this.getShareStat()).priceInDollars;
    // const boardroomlShareBalanceOf = await this.LSHARE.balanceOf(this.currentBoardroom().address);
    // boardroomTVL = Number(getDisplayBalance(boardroomlShareBalanceOf, this.LSHARE.decimal)) * Number(LSHAREPrice);

    return totalValue + boardroomTVL;
  }

  /**
   * Calculates the price of an LP token
   * Reference https://github.com/DefiDebauchery/discordpricebot/blob/4da3cdb57016df108ad2d0bb0c91cd8dd5f9d834/pricebot/pricebot.py#L150
   * @param lpToken the token under calculation
   * @param token the token pair used as reference (the other one would be FTM in most cases)
   * @param isLibra sanity check for usage of libra token or lShare
   * @returns price of the LP token
   */
  async getLPTokenPrice(lpToken: ERC20, token: ERC20, isLibra: boolean, isFake: boolean): Promise<string> {
    const totalSupply = getFullDisplayBalance(await lpToken.totalSupply(), lpToken.decimal);
    //Get amount of tokenA
    const tokenSupply = getFullDisplayBalance(await token.balanceOf(lpToken.address), token.decimal);
    const stat =
      // isFake === true
      // ? isLibra === true
      //   ? await this.get2ombStatFake()
      //   : await this.get2ShareStatFake()
      // :
      isLibra === true ? await this.getLibraStat() : await this.getShareStat();

    const priceOfToken = stat.priceInDollars;
    const tokenInLP = Number(tokenSupply) / Number(totalSupply);
    const tokenPrice = (Number(priceOfToken) * tokenInLP * 2) //We multiply by 2 since half the price of the lp token is the price of each piece of the pair. So twice gives the total
      .toString();
    return tokenPrice;
  }

  /*
  async getLibraStatFake() {
    const price = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=2omb-finance&vs_currencies=usd").then(res => res.json())
    return { priceInDollars: price["2omb-finance"].usd }
  }

  async getShareStatFake() {
    const price = await fetch("https://api.coingecko.com/api/v3/simple/price?ids=2share&vs_currencies=usd").then(res => res.json())
    return { priceInDollars: price["2share"].usd }
  }
*/
  // async get2ombStatFake(): Promise<TokenStat> {
  //   const { TwoOmbFtmRewardPool, TwoOmbFtmLpLibraRewardPool, TwoOmbFtmLpLibraRewardPoolOld } = this.contracts;
  //   const LIBRA = new ERC20('0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae', this.provider, '2OMB');
  //   const supply = await LIBRA.totalSupply();
  //   const libraRewardPoolSupply = await LIBRA.balanceOf(TwoOmbFtmRewardPool.address);
  //   const libraRewardPoolSupply2 = await LIBRA.balanceOf(TwoOmbFtmLpLibraRewardPool.address);
  //   const libraRewardPoolSupplyOld = await LIBRA.balanceOf(TwoOmbFtmLpLibraRewardPoolOld.address);
  //   const libraCirculatingSupply = supply
  //     .sub(libraRewardPoolSupply)
  //     .sub(libraRewardPoolSupply2)
  //     .sub(libraRewardPoolSupplyOld);
  //   const priceInASTR = await this.getTokenPriceFromLP(LIBRA);
  //   const priceOfOneFTM = await this.getWASTRPriceFromArthswapASTRUSDC();
  //   const priceOfLibraInDollars = (Number(priceInASTR) * Number(priceOfOneFTM)).toFixed(2);

  //   return {
  //     tokenInAstar: priceInASTR,
  //     priceInDollars: priceOfLibraInDollars,
  //     totalSupply: getDisplayBalance(supply, LIBRA.decimal, 0),
  //     circulatingSupply: getDisplayBalance(libraCirculatingSupply, LIBRA.decimal, 0),
  //   };
  // }

  // async get2ShareStatFake(): Promise<TokenStat> {
  //   const { TwoOmbFtmRewardPool, TwoOmbFtmLpLibraRewardPool, TwoOmbFtmLpLibraRewardPoolOld } = this.contracts;
  //   const LSHARE = new ERC20('0xc54a1684fd1bef1f077a336e6be4bd9a3096a6ca', this.provider, '2SHARES');
  //   const supply = await LSHARE.totalSupply();
  //   const libraRewardPoolSupply = await LSHARE.balanceOf(TwoOmbFtmRewardPool.address);
  //   const libraRewardPoolSupply2 = await LSHARE.balanceOf(TwoOmbFtmLpLibraRewardPool.address);
  //   const libraRewardPoolSupplyOld = await LSHARE.balanceOf(TwoOmbFtmLpLibraRewardPoolOld.address);
  //   const libraCirculatingSupply = supply
  //     .sub(libraRewardPoolSupply)
  //     .sub(libraRewardPoolSupply2)
  //     .sub(libraRewardPoolSupplyOld);
  //   const priceInASTR = await this.getTokenPriceFromLP(LSHARE);
  //   const priceOfOneFTM = await this.getWASTRPriceFromArthswapASTRUSDC();
  //   const priceOfLibraInDollars = (Number(priceInASTR) * Number(priceOfOneFTM)).toFixed(2);

  //   return {
  //     tokenInAstar: priceInASTR,
  //     priceInDollars: priceOfLibraInDollars,
  //     totalSupply: getDisplayBalance(supply, LSHARE.decimal, 0),
  //     circulatingSupply: getDisplayBalance(libraCirculatingSupply, LSHARE.decimal, 0),
  //   };
  // }

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
      console.error(`Failed to call earned() on pool ${pool.address}: ${err.stack}`);
      return BigNumber.from(0);
    }
  }

  async stakedBalanceOnBank(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<BigNumber> {
    const pool = this.contracts[poolName];
    try {
      let userInfo = await pool.userInfo(poolId, account);
      return await userInfo.amount;
    } catch (err) {
      console.error(`Failed to call balanceOf() on pool ${pool.address}: ${err.stack}`);
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
    return await pool.deposit(poolId, amount);
  }

  /**
   * Withdraws token from given pool.
   * @param poolName A name of pool contract.
   * @param amount Number of tokens with decimals applied. (e.g. 1.45 DAI * 10^18)
   * @returns {string} Transaction hash
   */
  async unstake(poolName: ContractName, poolId: Number, amount: BigNumber): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    return await pool.withdraw(poolId, amount);
  }

  /**
   * Transfers earned token reward from given pool to my account.
   */
  async harvest(poolName: ContractName, poolId: Number): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    //By passing 0 as the amount, we are asking the contract to only redeem the reward and not the currently staked token
    return await pool.withdraw(poolId, 0);
  }

  /**
   * Harvests and withdraws deposited tokens from the pool.
   */
  async exit(poolName: ContractName, poolId: Number, account = this.myAccount): Promise<TransactionResponse> {
    const pool = this.contracts[poolName];
    let userInfo = await pool.userInfo(poolId, account);
    return await pool.withdraw(poolId, userInfo.amount);
  }

  async fetchBoardroomVersionOfUser(): Promise<string> {
    return 'latest';
  }

  currentBoardroom(): Contract {
    if (!this.boardroomVersionOfUser) {
      //throw new Error('you must unlock the wallet to continue.');
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
    console.log('getTokenPriceFromLP: WASTR:', WASTR);
    const wastr = new Token(chainId, WASTR[0], WASTR[1]);
    const token = new Token(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
    console.log('getTokenPriceFromLP: wastr:', wastr);
    console.log('getTokenPriceFromLP: token:', token);
    try {
      console.log('getTokenPriceFromLP: Fetcher.fetchPairData1');
      const wastrToToken = await Fetcher.fetchPairData(wastr, token, this.provider);
      console.log('getTokenPriceFromLP: Fetcher.fetchPairData2');
      const priceInUSDC = new Route([wastrToToken], token);
      console.log('getTokenPriceFromLP: Fetcher.fetchPairData3');
      return priceInUSDC.midPrice.toFixed(4);
    } catch (err) {
      console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
    }
  }

  // async getTokenPriceFromSpiritswap(tokenContract: ERC20): Promise<string> {
  //   const ready = await this.provider.ready;
  //   if (!ready) return;
  //   const { chainId } = this.config;

  //   const { WFTM } = this.externalTokens;

  //   const wftm = new TokenSpirit(chainId, WFTM.address, WFTM.decimal);
  //   const token = new TokenSpirit(chainId, tokenContract.address, tokenContract.decimal, tokenContract.symbol);
  //   try {
  //     const wftmToToken = await FetcherSpirit.fetchPairData(wftm, token, this.provider);
  //     const liquidityToken = wftmToToken.liquidityToken;
  //     let ftmBalanceInLP = await WFTM.balanceOf(liquidityToken.address);
  //     let astarAmount = Number(getFullDisplayBalance(ftmBalanceInLP, WFTM.decimal));
  //     let shibaBalanceInLP = await tokenContract.balanceOf(liquidityToken.address);
  //     let shibaAmount = Number(getFullDisplayBalance(shibaBalanceInLP, tokenContract.decimal));
  //     const priceOfOneFtmInDollars = await this.getWASTRPriceFromArthswapASTRUSDC();
  //     let priceOfShiba = (astarAmount / shibaAmount) * Number(priceOfOneFtmInDollars);
  //     return priceOfShiba.toString();
  //   } catch (err) {
  //     console.error(`Failed to fetch token price of ${tokenContract.symbol}: ${err}`);
  //   }
  async getLSharePrice(): Promise<string> {
    console.log('LibraFinance: getLSharePrice .');
    const ready = await this.provider.ready;
    if (!ready) return;
    const { WASTR, LSHARE } = this.externalTokens;
    const lshare_astr_lp_pair = this.externalTokens['LSHARE-ASTR-LP'];

    let astr_amount_BN = await WASTR.balanceOf(lshare_astr_lp_pair.address);
    let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
    let LSHARE_amount_BN = await LSHARE.balanceOf(lshare_astr_lp_pair.address);
    let LSHARE_amount = Number(getFullDisplayBalance(LSHARE_amount_BN, lshare_astr_lp_pair.decimal));
    return (LSHARE_amount / astr_amount).toString();
  }
  async getLibraPriceFromLibraAstr(): Promise<string> {
    console.log('LibraFinance: getLibraPrice FromLibraAstr.');
    const ready = await this.provider.ready;
    if (!ready) return;
    // console.log('LibraFinance: getLibraPriceFromLibraAstr..');
    const { WASTR, LIBRA } = this.externalTokens;
    // console.log('LibraFinance: getLibraPriceFromLibraAstr....');
    const libra_astr_lp_pair = this.externalTokens['LIBRA-ASTR-LP'];
    // console.log('LibraFinance: getLibraPriceFromLibraAstr.......libra_astr_lp_pair = ' + libra_astr_lp_pair);
    let astr_amount_BN = await WASTR.balanceOf(libra_astr_lp_pair.address);
    let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
    // console.log('LibraFinance: getLibraPriceFromLibraAstr() 7. astr_amount=', astr_amount);
    let LIBRA_amount_BN = await LIBRA.balanceOf(libra_astr_lp_pair.address);
    let LIBRA_amount = Number(getFullDisplayBalance(LIBRA_amount_BN, libra_astr_lp_pair.decimal));
    // console.log('LibraFinance: getLibraPriceFromLibraAstr() 8. LIBRA_amount=', LIBRA_amount);
    return (LIBRA_amount / astr_amount).toString();
  }
  // }

  async getWASTRPriceFromArthswapASTRUSDC(): Promise<string> {
    console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() ');
    const ready = await this.provider.ready;
    console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 2');
    if (!ready) return;
    console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 3');
    // const { WFTM, USDC } = this.externalTokens;
    const { WASTR, USDC } = this.externalTokens;
    console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 4');
    try {
      console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 5');
      const astr_usdc_lp_pair = this.externalTokens['ASTR-USDC-LP'];
      console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 6. astr_usdc_lp_pair=', astr_usdc_lp_pair);
      let astr_amount_BN = await WASTR.balanceOf(astr_usdc_lp_pair.address);
      let astr_amount = Number(getFullDisplayBalance(astr_amount_BN, WASTR.decimal));
      console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 7. astr_amount=', astr_amount);
      let USDC_amount_BN = await USDC.balanceOf(astr_usdc_lp_pair.address);
      let USDC_amount = Number(getFullDisplayBalance(USDC_amount_BN, USDC.decimal));
      console.log('LibraFinance: getWASTRPriceFromArthswapASTRUSDC() 8. USDC_amount=', USDC_amount);
      return (USDC_amount / astr_amount).toString();
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
    const mason = await Boardroom.masons(this.myAccount);
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
    const mason = await Boardroom.masons(this.myAccount);
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

  async provideLibraFtmLP(astarAmount: string, libraAmount: BigNumber): Promise<TransactionResponse> {
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
    const { SpookyRouter } = this.contracts;
    const { _reserve0, _reserve1 } = await this.LIBRAWFTM_LP.getReserves();
    let quote;
    if (tokenName === 'LIBRA') {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve1, _reserve0);
    } else {
      quote = await SpookyRouter.quote(parseUnits(tokenAmount), _reserve0, _reserve1);
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
    const treasuryBoardroomFundedFilter = Treasury.filters.BoardroomFunded();
    const boughtBondsFilter = Treasury.filters.BoughtBonds();
    const redeemBondsFilter = Treasury.filters.RedeemedBonds();

    let epochBlocksRanges: any[] = [];
    let boardroomFundEvents = await Treasury.queryFilter(treasuryBoardroomFundedFilter);
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
    let DEVFundEvents = await Treasury.queryFilter(treasuryDevFundedFilter);
    DEVFundEvents.forEach(function callback(value, index) {
      events[index].devFund = getDisplayBalance(value.args[1]);
    });
    let DAOFundEvents = await Treasury.queryFilter(treasuryDaoFundedFilter);
    DAOFundEvents.forEach(function callback(value, index) {
      events[index].daoFund = getDisplayBalance(value.args[1]);
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
    if (tokenName === FTM_TICKER) {
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
    if (tokenName === FTM_TICKER) {
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
