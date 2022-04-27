// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@twinkleswap/sdk';
import { Configuration } from './tomb-finance/config';
import { BankInfo } from './tomb-finance';

export const AppHostEnv = window.location.host.includes('prod-env')
  ? 'prod'
  : window.location.host.includes('stag-env')
  ? 'stag'
  : 'test'; // basically, test.

// window.location.host.includes('test') || window.location.host.includes('localhost') ? 'test' : window.location.host.includes('librafinance.xyz')? 'test': window.location.host.includes('librafinance.xyz')? '' 'prod';

const configurations: { [env: string]: Configuration } = {
  production: {
    chainId: ChainId.MAINNET,
    networkName: 'Astar Network',
    ftmscanUrl: 'https://blockscout.com/astar/address/',
    // defaultProvider: 'https://rpc.ftm.tools/',
    defaultProvider: 'https://astar-api.bwarelabs.com/7d1b6401-caba-4a39-8a84-13d4e9f105b4',
    //WSS: wss://astar-api.bwarelabs.com/ws/7d1b6401-caba-4a39-8a84-13d4e9f105b4

    deployments: require('./tomb-finance/deployments/deployments.dev.json'),
    externalTokens: {
      // WFTM: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      // USDC: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      USDC: ['0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', 6], // Astar USDC

      // BOO: ['0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE', 18],
      // ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
      // SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      // BELUGA: ['0x4A13a2cf881f5378DEF61E430139Ed26d843Df9A', 18],
      // BIFI: ['0xd6070ae98b8069de6B494332d1A1a81B6179D960', 18],
      // MIM: ['0x82f0b8b456c1a451378467398982d4834b6829c1', 18],
      // BLOOM: ['0x9B2e37cDC711CfcAC1E1482B5741c74dd3924199', 9],
      // wFTM: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      wASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      WASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      // '2OMB': ['0x067e31D66Eb9376790ADFB1522F6Bef634D56a70', 18],
      LIBRA: ['0x09679d9DfA42146115988C6A84FEe0933D53b313', 18], // DUMMY

      // '2OMB-2SHARES LP': ['0xd9B5f00d183df52D717046521152303129F088DD', 18],
      // '2OMB-WFTM LP': ['0xbdC7DFb7B88183e87f003ca6B5a2F81202343478', 18],
      // '2SHARES-WFTM LP': ['0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52', 18],
      // '2SHARES': ['0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca', 18],
      // 'LIBRA-WFTM LP': ['0x83A52eff2E9D112E9B022399A9fD22a9DB7d33Ae', 18],
      'ASTR-USDC-LP': ['0xBB1290c1829007F440C771b37718FAbf309cd527', 18],
      'LIBRA-WASTR-LP': ['0xF3C8aC387E2254b92C0edD5e8307373099e394c6', 18], //DUMMY
      'LSHARE-WASTR-LP': ['0x4d40e2647F7b5D68a818af4b9eF17DD97b305A69', 18], //DUMMY
      LBOND: ['0x5508C3b4598D0a80a20EFD45d12717b8De4ad723', 18], // DUMMY
      // 'LSHARES-WFTM LP': ['0xd352daC95a91AfeFb112DBBB3463ccfA5EC15b65', 18],
      LSHARES: ['0xD86AE6E031b2277bd55e19A6DA73445280F838e9', 18], // DUMMY
      LSHARE: ['0xD86AE6E031b2277bd55e19A6DA73445280F838e9', 18], // DUMMY
      // 'USDT-FTM-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      // 'TOMB-FTM-LP': ['0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae', 18],
      // 'TOMB-FTM-LP': ['0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae', 18],
      // 'TSHARE-FTM-LP': ['0xd352dac95a91afefb112dbbb3463ccfa5ec15b65', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    masonryLaunchesAt: new Date('2020-12-11T00:00:00Z'),
    refreshInterval: 10000,
  },
};

export const bankDefinitions: { [contractName: string]: BankInfo } = {
  /*
  Explanation:
  name: description of the card
  poolId: the poolId assigned in the contract
  sectionInUI: way to distinguish in which of the 3 pool groups it should be listed
        - 0 = Single asset stake pools
        - 1 = LP asset staking rewarding TOMB
        - 2 = LP asset staking rewarding TSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  // Tomb2sharesRewardPool: {
  //   name: 'Earn LIBRA by staking 2SHARES',
  //   poolId: 0,
  //   sectionInUI: 0,
  //   contract: 'Tomb2ShareRewardPool',
  //   depositTokenName: '2SHARES',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '7500x',
  //   site: 'https://2omb.finance',
  //   buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae',
  //   sort: 0,
  //   closedForStaking: true,
  // },
  // Tomb2sharesWftmLPRewardPool: {
  //   name: 'Earn LIBRA by staking 2SHARES-WFTM LP',
  //   poolId: 1,
  //   sectionInUI: 0,
  //   contract: 'Tomb2SharesWftmLPRewardPool',
  //   depositTokenName: '2SHARES-WFTM LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '6000x',
  //   site: 'https://2omb.finance',
  //   buyLink: 'https://spookyswap.finance/add/FTM/0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca',
  //   sort: 1,
  //   closedForStaking: true,
  // },
  // Tomb2shares2ombLPRewardPool: {
  //   name: 'Earn LIBRA by staking 2OMB-2SHARES LP',
  //   poolId: 2,
  //   sectionInUI: 0,
  //   contract: 'Tomb2Shares2ombLPRewardPool',
  //   depositTokenName: '2OMB-2SHARES LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '6000',
  //   site: "https://2omb.finance",
  //   buyLink: 'https://spookyswap.finance/add/0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae/0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca',
  //   sort: 2,
  //   closedForStaking: false,
  // },
  // Tomb2ombWftmLPRewardPool: {
  //   name: 'Earn LIBRA by staking 2OMB-WFTM LP',
  //   poolId: 2,
  //   sectionInUI: 0,
  //   contract: 'Tomb2ombWftmLPRewardPool',
  //   depositTokenName: '2OMB-WFTM LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '6000x',
  //   site: 'https://2omb.finance',
  //   buyLink: 'https://spookyswap.finance/add/FTM/0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae',
  //   sort: 3,
  //   closedForStaking: true,
  // },
  // Tomb2ombRewardPool: {
  //   name: 'Earn LIBRA by staking 2OMB',
  //   poolId: 3,
  //   sectionInUI: 0,
  //   contract: 'Tomb2ombRewardPool',
  //   depositTokenName: '2OMB',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '5000x',
  //   site: 'https://2omb.finance',
  //   buyLink: 'https://spookyswap.finance/swap?outputCurrency=0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae',
  //   sort: 4,
  //   closedForStaking: true,
  // },
  // TombBelugaRewardPool: {
  //   name: 'Earn LIBRA by staking BELUGA',
  //   poolId: 4,
  //   sectionInUI: 0,
  //   contract: 'TombBelugaRewardPool',
  //   depositTokenName: 'BELUGA',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '500x',
  //   site: 'https://beluga.fi',
  //   buyLink:
  //     'https://beets.fi/#/trade/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83/0x4A13a2cf881f5378DEF61E430139Ed26d843Df9A',
  //   sort: 5,
  //   closedForStaking: true,
  // },
  // TombBifiRewardPool: {
  //   name: 'Earn LIBRA by staking BIFI',
  //   poolId: 5,
  //   sectionInUI: 0,
  //   contract: 'TombBifiGenesisRewardPool',
  //   depositTokenName: 'BIFI',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '500x',
  //   site: 'https://app.beefy.finance/#/fantom',
  //   buyLink:
  //     'https://beets.fi/#/trade/0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83/0xd6070ae98b8069de6B494332d1A1a81B6179D960',
  //   sort: 6,
  //   closedForStaking: true,
  // },
  // TombWrappedFtmRewardPool: {
  //   name: 'Earn LIBRA by staking WFTM',
  //   poolId: 0,
  //   sectionInUI: 0,
  //   contract: 'TombWrappedFtmRewardPool',
  //   depositTokenName: 'wFTM',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '500x',
  // site: 'https://fantom.foundation',
  // buyLink: 'https://ecoswap.exchange',
  //   sort: 7,
  //   closedForStaking: true,
  // },
  TombWrappedAstarRewardPool: {
    name: 'Earn LIBRA by staking WASTR',
    poolId: 0,
    sectionInUI: 0,
    contract: 'TombWrappedFtmRewardPool',
    depositTokenName: 'WASTR',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '500x',
    site: 'https://astar.network',
    buyLink: 'https://librax.finance',
    sort: 7,
    closedForStaking: true,
  },
  // TombMimRewardPool: {
  //   name: 'Earn LIBRA by staking MIM',
  //   poolId: 7,
  //   sectionInUI: 0,
  //   contract: 'TombMimGenesisRewardPool',
  //   depositTokenName: 'MIM',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '500x',
  //   site: 'https://abracadabra.money/',
  //   buyLink: 'https://ftm.curve.fi/factory/7',
  //   sort: 8,
  //   closedForStaking: true,
  // },
  // TombBloomRewardPool: {
  //   name: 'Earn LIBRA by staking BLOOM',
  //   poolId: 8,
  //   sectionInUI: 0,
  //   contract: 'TombBloomGenesisRewardPool',
  //   depositTokenName: 'BLOOM',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '500x (0.04% Deposit Fee)',
  //   site: 'https://bloom.thetulipdao.com/',
  //   buyLink: 'https://swap.spiritswap.finance/#/exchange/swap/FTM/0x9B2e37cDC711CfcAC1E1482B5741c74dd3924199',
  //   sort: 9,
  //   closedForStaking: true,
  // },
  TombFtmLPTombRewardPool: {
    name: 'Earn TOMB by TOMB-FTM LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'TombFtmLpTombRewardPool',
    depositTokenName: 'TOMB-FTM-LP',
    earnTokenName: 'TOMB',
    finished: false,
    multiplier: '0',
    buyLink: '',
    site: '',
    sort: 7,
    closedForStaking: true,
  },
  TombFtmLPTombRewardPoolOld: {
    name: 'Earn TOMB by TOMB-FTM LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'TombFtmLpTombRewardPoolOld',
    depositTokenName: 'TOMB-FTM-LP',
    earnTokenName: 'TOMB',
    finished: true,
    multiplier: '0',
    buyLink: '',
    site: '',
    sort: 9,
    closedForStaking: true,
  },
  TombFtmLPTShareRewardPool: {
    name: 'Earn LSHARES by LIBRA-WASTR LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'TombFtmLPTShareRewardPool',
    depositTokenName: 'LIBRA-WASTR LP',
    earnTokenName: 'LSHARES',
    finished: false,
    multiplier: '35500x',
    buyLink: 'https://spookyswap.finance/add/FTM/0x14DEf7584A6c52f470Ca4F4b9671056b22f4FfDE',
    site: '/',
    sort: 8,
    closedForStaking: false,
  },
  TshareFtmLPTShareRewardPool: {
    name: 'Earn LSHARES by LSHARES-WFTM LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'TshareFtmLPTShareRewardPool',
    depositTokenName: 'LSHARES-WFTM LP',
    earnTokenName: 'LSHARES',
    finished: false,
    multiplier: '24000x',
    buyLink: 'https://spookyswap.finance/add/FTM/0x6437ADAC543583C4b31Bf0323A0870430F5CC2e7',
    site: '/',
    sort: 9,
    closedForStaking: false,
  },
  TwoshareFtmLPTShareRewardPool: {
    name: 'Earn LSHARES by 2SHARES-WFTM LP',
    poolId: 2,
    sectionInUI: 2,
    contract: 'TwoshareFtmLPTShareRewardPool',
    depositTokenName: '2SHARES-WFTM LP',
    earnTokenName: 'LSHARES',
    finished: false,
    multiplier: '15000x',
    buyLink: 'https://spookyswap.finance/add/FTM/0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca',
    site: 'https://2omb.finance',
    sort: 10,
    closedForStaking: false,
  },
  TwoombFtmLPTShareRewardPool: {
    name: 'Earn LSHARES by 2OMB-WFTM LP',
    poolId: 3,
    sectionInUI: 2,
    contract: 'TwoombFtmLPTShareRewardPool',
    depositTokenName: '2OMB-WFTM LP',
    earnTokenName: 'LSHARES',
    finished: false,
    multiplier: '15000x',
    buyLink: 'https://spookyswap.finance/add/FTM/0x7a6e4e3cc2ac9924605dca4ba31d1831c84b44ae',
    site: 'https://2omb.finance',
    sort: 11,
    closedForStaking: false,
  },
  // TwoombTwosharesLPTShareRewardPool: {
  //   name: 'Earn LSHARES by 2OMB-2SHARES LP',
  //   poolId: 4,
  //   sectionInUI: 2,
  //   contract: 'TwoombTwosharesLPTShareRewardPool',
  //   depositTokenName: '2OMB-2SHARESLP',
  //   earnTokenName: 'TSHARE',
  //   finished: false,
  //   multiplier: '0',
  //   buyLink: '',
  //   site: '',
  //   sort: 12,
  //   closedForStaking: false,
  // },
  Tomb2SHARESRebates: {
    name: 'Bond 2SHARES, earn LIBRA',
    poolId: 0,
    sectionInUI: 3,
    contract: 'TombFtmRewardPool',
    depositTokenName: '2SHARES',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '10000x',
    buyLink: '',
    site: '',
    sort: 5,
    closedForStaking: false,
  },
  USDCRebates: {
    name: 'Bond USDC, earn LIBRA',
    poolId: 1,
    sectionInUI: 3,
    contract: 'TombFtmRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '15000x',
    buyLink: '',
    site: '',
    sort: 6,
    closedForStaking: false,
  },
  Tomb2SHARESFTMRebates: {
    name: 'Bond 2SHARES-WFTM LP, earn LIBRA',
    poolId: 2,
    sectionInUI: 3,
    contract: 'TombFtmRewardPool',
    depositTokenName: '2SHARES-WFTM LP',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '12000x',
    buyLink: '',
    site: '',
    sort: 4,
    closedForStaking: false,
  },
  // TombLIBRAFTMRebates: {
  //   name: 'Bond LIBRA-WASTR LP, earn LIBRA',
  //   poolId: 3,
  //   sectionInUI: 3,
  //   contract: 'TombFtmRewardPool',
  //   depositTokenName: 'LIBRA-WASTR LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '6000x',
  //   buyLink: '',
  //   site: '',
  //   sort: 1,
  //   closedForStaking: false,
  // },
  TombLSHARESRebates: {
    name: 'Bond LSHARES, earn LIBRA',
    poolId: 4,
    sectionInUI: 3,
    contract: 'TombFtmRewardPool',
    depositTokenName: 'LSHARES',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '5000x',
    buyLink: '',
    site: '',
    sort: 3,
    closedForStaking: false,
  },
  //TombLSHARESFTMRebates: {
  // name: 'Bond LSHARES-WFTM LP, earn LIBRA',
  // poolId: 5,
  // sectionInUI: 3,
  //  contract: 'TombFtmRewardPool',
  //  depositTokenName: 'LSHARES-WFTM LP',
  //  earnTokenName: 'LIBRA',
  //  finished: false,
  //  multiplier: '6000x',
  //  buyLink: '',
  //   site: '',
  //   sort: 2,
  //   closedForStaking: false,
  // },
};

export default configurations['production'];
