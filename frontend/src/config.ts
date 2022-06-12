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
    // astrscanUrl: 'https://blockscout.com/astar/address/',
    astrscanUrl: 'https://blockscout.com/astar',
    // astrscanUrl: 'https://astar.subscan.io',
    // defaultProvider: 'https://rpc.ftm.tools/',
    // defaultProvider: 'https://astar-api.bwarelabs.com/7d1b6401-caba-4a39-8a84-13d4e9f105b4',
    // defaultProvider: 'https://evm.astar.network',
    defaultProvider: 'https://evm.astar.network',

    //WSS: wss://astar-api.bwarelabs.com/ws/7d1b6401-caba-4a39-8a84-13d4e9f105b4

    deployments: require('./libra-finance/deployments/deployments.dev.json'),
    externalTokens: {
      USDC: ['0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', 6], // Astar USDC
      JPYC: ['0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB', 18], // Astar JPYC
      WASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],

      'ASTR-USDC-LP': ['0xBB1290c1829007F440C771b37718FAbf309cd527', 18],
      'WASTR-USDC-LP-LIBRAX': ['0x139B81e5728026FAA8d7Ef6C79bb07f4d912641B', 18], // LibraX Pair
      'LIBRA-WASTR-LP': ['0xe0A53B6543B6cd2FB6407dF68CEae7d1ef50dbB1', 18], //DUMMY
      'LSHARE-WASTR-LP': ['0x0454F7FAd41a7B880feb8AD7F0c49CC87C1189ee', 18], //DUMMY
      LIBRA: ['0x68BBF7ce3C128bb1c51d2a01C486cA9B8E499BB7', 18], // DUMMY
      LBOND: ['0xaD321F85b4b289b6313616bC89B4681373C2C8e6', 18], // DUMMY
      LSHARE: ['0x246cd2e709b5F7313e1228e19e010EACD90fCf31', 18], // DUMMY
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

  // UsdcAstarLPGenesisRewardPool: {
  //   name: 'Earn LIBRA by staking ASTR-USDC-LP on LibraX',
  //   poolId: 3, // Must check
  //   sectionInUI: 0,
  //   contract: 'UsdcAstarLPGenesisRewardPool',
  //   depositTokenName: 'WASTR-USDC-LP-LIBRAX',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '250x',
  //   site: 'https://astar.network',
  //   buyLink: '',
  //   createLpLink:
  //     'https://librax.finance/add/' +
  //     '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720' +
  //     '/' +
  //     '0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
  //   sort: 1,
  //   closedForStaking: true,
  // },

  JpycGenesisRewardPool: {
    name: 'Earn LIBRA by staking JPYC',
    poolId: 2,
    sectionInUI: 0,
    contract: 'JpycGenesisRewardPool',
    depositTokenName: 'JPYC',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '150x',
    site: 'https://astar.network',
    buyLink: 'https://librax.finance/swap/' + '0x431D5dfF03120AFA4bDf332c61A6e1766eF37BDB',
    createLpLink: '',
    sort: 1,
    closedForStaking: true,
  },

  UsdcGenesisRewardPool: {
    name: 'Earn LIBRA by staking USDC',
    poolId: 1,
    sectionInUI: 0,
    contract: 'UsdcGenesisRewardPool',
    depositTokenName: 'USDC',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '100x',
    site: 'https://astar.network',
    buyLink: 'https://app.arthswap.org/#/swap?outputCurrency=0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98',
    createLpLink: '',
    sort: 1,
    closedForStaking: true,
  },

  AstarGenesisRewardPool: {
    name: 'Earn LIBRA by staking WASTR',
    poolId: 0, // Must check
    sectionInUI: 0,
    contract: 'AstarGenesisRewardPool',
    depositTokenName: 'WASTR',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '600x',
    site: 'https://astar.network',
    buyLink: 'https://librax.finance/swap/' + '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', //[LIBRA FINANCE]token address will be added
    createLpLink: '',
    sort: 1,
    closedForStaking: true,
  },

  LibraAstarLPLibraRewardPool: {
    name: 'Earn LIBRA by LIBRA-WASTR LP',
    poolId: 0,
    sectionInUI: 1,
    contract: 'LibraRewardPool',
    depositTokenName: 'LIBRA-WASTR-LP',
    earnTokenName: 'LIBRA',
    finished: false,
    multiplier: '0',
    buyLink: '',
    createLpLink:
      'https://librax.finance/add/' +
      '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720' +
      '/' +
      '0x68BBF7ce3C128bb1c51d2a01C486cA9B8E499BB7',
    site: '',
    sort: 2,
    closedForStaking: false,
  },

  LibraAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LIBRA-WASTR LP',
    poolId: 0,
    sectionInUI: 2,
    contract: 'LibraAstarLPLShareRewardPool',
    depositTokenName: 'LIBRA-WASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '100x',
    buyLink: '',
    createLpLink:
      'https://librax.finance/add/' +
      '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720' +
      '/' +
      '0x68BBF7ce3C128bb1c51d2a01C486cA9B8E499BB7',
    site: '/',
    sort: 3,
    closedForStaking: false,
  },

  LshareAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LSHARE-WASTR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'LshareAstarLPLShareRewardPool',
    depositTokenName: 'LSHARE-WASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '100x',
    buyLink: '',
    createLpLink:
      'https://librax.finance/add/' +
      '0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720' +
      '/' +
      '0x246cd2e709b5F7313e1228e19e010EACD90fCf31',
    site: '/',
    sort: 9,
    closedForStaking: false,
  },

  // USDCRebates: {
  //   name: 'Bond USDC, earn LIBRA',
  //   poolId: 1,
  //   sectionInUI: 3,
  //   contract: 'LibraRewardPool',
  //   depositTokenName: 'USDC',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '15000x',
  //   buyLink: '',
  //   site: '',
  //   sort: 6,
  //   closedForStaking: false,
  // },
  // LibraLSHAREASTRRebates: {
  //   name: 'Bond LSHARE-WASTR LP, earn LIBRA',
  //   poolId: 2,
  //   sectionInUI: 3,
  //   contract: 'LibraRewardPool',
  //   depositTokenName: 'LSHARE-WASTR LP',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '12000x',
  //   buyLink: '',
  //   site: '',
  //   sort: 4,
  //   closedForStaking: false,
  // },
  // LibraLSHARERebates: {
  //   name: 'Bond LSHARE, earn LIBRA',
  //   poolId: 4,
  //   sectionInUI: 3,
  //   contract: 'LibraRewardPool',
  //   depositTokenName: 'LSHARE',
  //   earnTokenName: 'LIBRA',
  //   finished: false,
  //   multiplier: '5000x',
  //   buyLink: '',
  //   site: '',
  //   sort: 3,
  //   closedForStaking: false,
  // },
};

export default configurations['production'];
