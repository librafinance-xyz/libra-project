import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { web3ProviderFrom } from '../libra-finance/ether-utils';
import { getBalance } from '../utils/formatBalance';
import axios from 'axios';

// const web3 = new Web3('https://rpcapi.fantom.network/');
const web3 = new Web3('https://astar-api.bwarelabs.com/7d1b6401-caba-4a39-8a84-13d4e9f105b4');
const ERC20ABI = [
  {
    constant: true,
    inputs: [],
    name: 'name',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_spender', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'approve',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'totalSupply',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_from', type: 'address' },
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transferFrom',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'decimals',
    outputs: [{ name: '', type: 'uint8' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [{ name: '_owner', type: 'address' }],
    name: 'balanceOf',
    outputs: [{ name: 'balance', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: true,
    inputs: [],
    name: 'symbol',
    outputs: [{ name: '', type: 'string' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  {
    constant: false,
    inputs: [
      { name: '_to', type: 'address' },
      { name: '_value', type: 'uint256' },
    ],
    name: 'transfer',
    outputs: [{ name: '', type: 'bool' }],
    payable: false,
    stateMutability: 'nonpayable',
    type: 'function',
  },
  {
    constant: true,
    inputs: [
      { name: '_owner', type: 'address' },
      { name: '_spender', type: 'address' },
    ],
    name: 'allowance',
    outputs: [{ name: '', type: 'uint256' }],
    payable: false,
    stateMutability: 'view',
    type: 'function',
  },
  { payable: true, stateMutability: 'payable', type: 'fallback' },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'owner', type: 'address' },
      { indexed: true, name: 'spender', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Approval',
    type: 'event',
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, name: 'from', type: 'address' },
      { indexed: true, name: 'to', type: 'address' },
      { indexed: false, name: 'value', type: 'uint256' },
    ],
    name: 'Transfer',
    type: 'event',
  },
];
const treasuryAddress = '0x8f555E00ea0FAc871b3Aa70C015915dB094E7f88';

// const assetList = [
//     "0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca", // 2shares
//     "0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52", // 2shares/ASTR LP
//     "0x83A52eff2E9D112E9B022399A9fD22a9DB7d33Ae", // libra/wftm
//     "0x6437ADAC543583C4b31Bf0323A0870430F5CC2e7", // Lshares
//     "0xd352daC95a91AfeFb112DBBB3463ccfA5EC15b65", // Lshares/wftm
// ]

// const contracts = assetList.map(asset => new web3.eth.Contract(ERC20ABI, asset))

// function useTotalTreasuryBalance() {
//     const [ prices, setPrices ] = useState(assetList.map(asset => {
//         return { token: asset, value: 0 }
//     }))
//     useEffect(() => {
//         getPrices()
//     }, [])

//     async function getPrices() {
//         for (const token of contracts) {
//             console.log(token)
//         }
//     }

//     return prices
// }

function useTotalTreasuryBalance() {
  const ThreeShares = new web3.eth.Contract(ERC20ABI, '0x6437ADAC543583C4b31Bf0323A0870430F5CC2e7');
  const WASTR = new web3.eth.Contract(ERC20ABI, '0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83');
  const [balance, setBalance] = useState(0);
  const [balance_2shares_wftm, setBalance_2shares_wftm] = useState(0);
  const [balance_libra_wftm, setBalance_libra_wftm] = useState(0);
  const [balance_Lshares_wftm, setBalance_Lshares_wftm] = useState(0);
  const [balance_libra, setBalance_libra] = useState(0);
  const [balance_Lshares, setBalance_Lshares] = useState(0);
  const [balance_2shares, setBalance_2shares] = useState(0);

  useEffect(() => {
    getBalance();
    const interval = setInterval(() => {
      getBalance();
    }, 30000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  return {
    balance,
    balance_2shares_wftm,
    balance_libra_wftm,
    balance_Lshares_wftm,
    balance_libra,
    balance_Lshares,
    balance_2shares,
  };

  async function getBalance() {
    // const { data2omb } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=2omb-fi')
    // const { data2shares } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=2share')
    // const { datalibra } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=30mb-token')

    const { data } = await axios('https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&ids=3shares');
    const threeSharesBalance = web3.utils.fromWei(await ThreeShares.methods.balanceOf(treasuryAddress).call());
    const valueLshares = threeSharesBalance * data[0].current_price;

    const data2sharesAndlibra = await axios(
      'https://openapi.debank.com/v1/user/chain_balance?id=0x8f555E00ea0FAc871b3Aa70C015915dB094E7f88&chain_id=ftm',
    );

    console.log(`LShares USD: $${valueLshares}`);
    console.log(`2Shares + libra: $${data2sharesAndlibra.data.usd_value}`);
    const LP_2shares_wftm = await getLPPrice(
      '0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52',
      '0xc54a1684fd1bef1f077a336e6be4bd9a3096a6ca',
    );
    const LP_libra_wftm = await getLPPrice(
      '0x83A52eff2E9D112E9B022399A9fD22a9DB7d33Ae',
      '0x14def7584a6c52f470ca4f4b9671056b22f4ffde',
    );
    const LP_Lshares_wftm = await getLPPrice(
      '0xd352daC95a91AfeFb112DBBB3463ccfA5EC15b65',
      '0x6437adac543583c4b31bf0323a0870430f5cc2e7',
    );
    setBalance(data2sharesAndlibra.data.usd_value + valueLshares + LP_2shares_wftm + LP_libra_wftm + LP_Lshares_wftm);
    setBalance_2shares_wftm(LP_2shares_wftm);
    setBalance_libra_wftm(LP_libra_wftm);
    setBalance_Lshares_wftm(LP_Lshares_wftm);
    setBalance_libra(await getlibraBalance());
    setBalance_Lshares(await getLsharesBalance());
    setBalance_2shares(await get2sharesBalance());
  }

  async function getlibraBalance() {
    const tokenlibra = new web3.eth.Contract(ERC20ABI, '0x14DEf7584A6c52f470Ca4F4b9671056b22f4FfDE');
    const { data } = await axios(
      `https://fantom.api.0x.org/swap/v1/quote?buyToken=USDC&sellToken=0x14DEf7584A6c52f470Ca4F4b9671056b22f4FfDE&sellAmount=100000000000000000`,
    );
    const usdValue =
      Number(web3.utils.fromWei(await tokenlibra.methods.balanceOf(treasuryAddress).call())) * Number(data.price);

    return usdValue;
  }

  async function getLsharesBalance() {
    const tokenLshares = new web3.eth.Contract(ERC20ABI, '0x6437ADAC543583C4b31Bf0323A0870430F5CC2e7');
    const { data } = await axios(
      `https://fantom.api.0x.org/swap/v1/quote?buyToken=USDC&sellToken=0x6437ADAC543583C4b31Bf0323A0870430F5CC2e7&sellAmount=100000000000000000`,
    );
    const usdValue =
      Number(web3.utils.fromWei(await tokenLshares.methods.balanceOf(treasuryAddress).call())) * Number(data.price);

    return usdValue;
  }

  async function get2sharesBalance() {
    const token2shares = new web3.eth.Contract(ERC20ABI, '0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca');
    const { data } = await axios(
      `https://fantom.api.0x.org/swap/v1/quote?buyToken=USDC&sellToken=0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca&sellAmount=100000000000000000`,
    );
    const usdValue =
      Number(web3.utils.fromWei(await token2shares.methods.balanceOf(treasuryAddress).call())) * Number(data.price);

    return usdValue;
  }

  async function getLPPrice(LPAddress, tokenAddress) {
    const token = new web3.eth.Contract(ERC20ABI, tokenAddress);
    const LPtoken = new web3.eth.Contract(ERC20ABI, LPAddress);
    const { data } = await axios('https://api.binance.com/api/v1/ticker/price?symbol=ASTRUSDT');
    const wftmValue = Number(web3.utils.fromWei(await WASTR.methods.balanceOf(LPAddress).call())) * Number(data.price);

    const tokenValue =
      Number(await getTokenPrice(tokenAddress)) *
      Number(web3.utils.fromWei(await token.methods.balanceOf(LPAddress).call()));

    const OneTokenValue =
      (wftmValue + tokenValue) / Number(web3.utils.fromWei(await LPtoken.methods.totalSupply().call()));

    const total = OneTokenValue * Number(web3.utils.fromWei(await LPtoken.methods.balanceOf(treasuryAddress).call()));

    console.log(wftmValue);
    console.log(tokenValue);
    console.log(OneTokenValue);
    console.log(total);

    return total;
  }

  async function getTokenPrice(tokenAddress) {
    const { data } = await axios(
      `https://fantom.api.0x.org/swap/v1/quote?buyToken=USDC&sellToken=${tokenAddress}&sellAmount=100000000000000000`,
    );
    return data.price;
  }
}

export default useTotalTreasuryBalance;
