// import { ChainId } from '@pancakeswap-libs/sdk';
import { ChainId } from '@librax/sdk';
import { Configuration } from './libra-finance/config';
import { BankInfo } from './libra-finance';

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
    astrscanUrl: 'https://blockscout.com/astar/address/',
    // defaultProvider: 'https://rpc.ftm.tools/',
    defaultProvider: 'https://astar-api.bwarelabs.com/7d1b6401-caba-4a39-8a84-13d4e9f105b4',
    //WSS: wss://astar-api.bwarelabs.com/ws/7d1b6401-caba-4a39-8a84-13d4e9f105b4

    deployments: require('./libra-finance/deployments/deployments.dev.json'),
    externalTokens: {
      // WASTR: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      // USDC: ['0x04068DA6C83AFCFA0e13ba15A6696662335D5B75', 6],
      USDC: ['0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', 6], // Astar USDC

      // BOO: ['0x841FAD6EAe12c286d1Fd18d1d525DFfA75C7EFFE', 18],
      // ZOO: ['0x09e145a1d53c0045f41aeef25d8ff982ae74dd56', 0],
      // SHIBA: ['0x9ba3e4f84a34df4e08c112e1a0ff148b81655615', 9],
      // BELUGA: ['0x4A13a2cf881f5378DEF61E430139Ed26d843Df9A', 18],
      // BIFI: ['0xd6070ae98b8069de6B494332d1A1a81B6179D960', 18],
      // MIM: ['0x82f0b8b456c1a451378467398982d4834b6829c1', 18],
      // BLOOM: ['0x9B2e37cDC711CfcAC1E1482B5741c74dd3924199', 9],
      // wASTR: ['0x21be370d5312f44cb42ce377bc9b8a0cef1a4c83', 18],
      wASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      WASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      // 'LIBRA': ['0x067e31D66Eb9376790ADFB1522F6Bef634D56a70', 18],
      LIBRA: ['0x6d664cfe0ce55bced5250b9cc3f04e98a239ef22', 18], // DUMMY

      // 'LIBRA-LSHARE LP': ['0xd9B5f00d183df52D717046521152303129F088DD', 18],
      // 'LIBRA-WASTR LP': ['0xbdC7DFb7B88183e87f003ca6B5a2F81202343478', 18],
      // 'LSHARE-WASTR LP': ['0x6398ACBBAB2561553a9e458Ab67dCFbD58944e52', 18],
      // 'LSHARE': ['0xc54A1684fD1bef1f077a336E6be4Bd9a3096a6Ca', 18],
      // 'LIBRA-WASTR LP': ['0x83A52eff2E9D112E9B022399A9fD22a9DB7d33Ae', 18],
      'ASTR-USDC-LP': ['0xBB1290c1829007F440C771b37718FAbf309cd527', 18],
      // 'LIBRA-ASTR-LP': ['0xf4E19B3960a3ae1c08209f7709BFe15D4E19470a', 18], //DUMMY
      'LIBRA-ASTR-LP': ['0xf4E19B3960a3ae1c08209f7709BFe15D4E19470a', 18], //DUMMY

      'LSHARE-ASTR-LP': ['0x6e33b35C2dFB2fAC7c384A0c64B563a1B118681c', 18], //DUMMY
      LBOND: ['0xe14beD310c733b6011785eA3728C31F2f017e71B', 18], // DUMMY
      // 'LSHARE-WASTR LP': ['0xd352daC95a91AfeFb112DBBB3463ccfA5EC15b65', 18],
      // LSHARE: ['0xedFF72F95f0574cb74812237dA3B099f3Ef2bf2E', 18], // DUMMY
      LSHARE: ['0xedFF72F95f0574cb74812237dA3B099f3Ef2bf2E', 18], // DUMMY
      // 'USDT-ASTR-LP': ['0x2b4C76d0dc16BE1C31D4C1DC53bF9B45987Fc75c', 18],
      // 'LIBRA-ASTR-LP': ['0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae', 18],
      // 'LIBRA-ASTR-LP': ['0x83a52eff2e9d112e9b022399a9fd22a9db7d33ae', 18],
      // 'LSHARE-ASTR-LP': ['0xd352dac95a91afefb112dbbb3463ccfa5ec15b65', 18],
    },
    baseLaunchDate: new Date('2021-06-02 13:00:00Z'),
    bondLaunchesAt: new Date('2020-12-03T15:00:00Z'),
    boardroomLaunchesAt: new Date('2020-12-11T00:00:00Z'),
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
        - 1 = LP asset staking rewarding LIBRA
        - 2 = LP asset staking rewarding LSHARE
  contract: the contract name which will be loaded from the deployment.environmnet.json
  depositTokenName : the name of the token to be deposited
  earnTokenName: the rewarded token
  finished: will disable the pool on the UI if set to true
  sort: the order of the pool
  */
  
  LibraAstarRewardPool: {
    name: 'Earn LIBRA by staking WASTR',
    poolId: 0,
    sectionInUI: 0,
    contract: 'LibraAstarRewardPool',
    depositTokenName: 'WASTR',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '500x',
    site: 'https://astar.network',
    buyLink: 'https://librax.finance',
    sort: 7,
    closedForStaking: true,
  },
 
  LibraAstrLPLibraRewardPool: {
    name: 'Earn LIBRA by LIBRA-ASTR LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'LibraRewardPool',
    depositTokenName: 'LIBRA-ASTR-LP',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '0',
    buyLink: '',
    site: '',
    sort: 7,
    closedForStaking: true,
  },
  // LibraAstrLPLibraRewardPoolOld: {
  //   name: 'Earn LIBRA by LIBRA-ASTR LP',
  //   poolId: 0,
  //   sectionInUI: 1,
  //   contract: 'LibraFtmLpLibraRewardPoolOld',
  //   depositTokenName: 'LIBRA-ASTR-LP',
  //   earnTokenName: 'LIBRA',
  //   finished: true,
  //   multiplier: '0',
  //   buyLink: '',
  //   site: '',
  //   sort: 9,
  //   closedForStaking: true,
  // },
  LibraAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LIBRA-WASTR LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'LShareRewardPool',
    depositTokenName: 'LIBRA-ASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '24000x',
    buyLink: 'https://www.librax.finance/add/ASTR', //[LIBRA FINANCE]token address will be added
    site: '/',
    sort: 8,
    closedForStaking: false,
  },
  LshareAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LSHARE-WASTR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'LShareRewardPool',
    depositTokenName: 'LSHARE-ASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '35500x',
    buyLink: 'https://www.librax.finance/add/ASTR', //[LIBRA FINANCE]token address will be added
    site: '/',
    sort: 9,
    closedForStaking: false,
  },


  USDCRebates: {
    name: 'Bond USDC, earn LIBRA',
    poolId: 1,
    sectionInUI: 3,
    contract: 'LibraRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '15000x',
    buyLink: '',
    site: '',
    sort: 6,
    closedForStaking: false,
  },
  LibraLSHAREASTRRebates: {
    name: 'Bond LSHARE-WASTR LP, earn LIBRA',
    poolId: 2,
    sectionInUI: 3,
    contract: 'LibraRewardPool',
    depositTokenName: 'LSHARE-WASTR LP',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '12000x',
    buyLink: '',
    site: '',
    sort: 4,
    closedForStaking: false,
  },
  // LibraLIBRAASTRRebates: {
  //   name: 'Bond LIBRA-WASTR LP, earn LIBRA',
  //   poolId: 3,
  //   sectionInUI: 3,
  //   contract: 'LibraRewardPool',
  //   depositTokenName: 'LIBRA-WASTR LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '6000x',
  //   buyLink: '',
  //   site: '',
  //   sort: 1,
  //   closedForStaking: false,
  // },
  LibraLSHARERebates: {
    name: 'Bond LSHARE, earn LIBRA',
    poolId: 4,
    sectionInUI: 3,
    contract: 'LibraRewardPool',
    depositTokenName: 'LSHARE',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '5000x',
    buyLink: '',
    site: '',
    sort: 3,
    closedForStaking: false,
  },

};

export default configurations['production'];
