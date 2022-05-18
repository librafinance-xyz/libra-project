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
    // defaultProvider: 'https://astar-api.bwarelabs.com/7d1b6401-caba-4a39-8a84-13d4e9f105b4',
    // defaultProvider: 'https://evm.astar.network',
    defaultProvider: 'https://astar.blastapi.io/a14986c5-535f-418d-91db-d1c6d632bfdc',
    
  
    //WSS: wss://astar-api.bwarelabs.com/ws/7d1b6401-caba-4a39-8a84-13d4e9f105b4

    deployments: require('./libra-finance/deployments/deployments.dev.json'),
    externalTokens: {
      USDC: ['0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', 6], // Astar USDC
      wASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      WASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      LIBRA: ['0x78867EB905c34fD13378564BbE26e71EFf19867d', 18], // DUMMY

      'ASTR-USDC-LP': ['0xBB1290c1829007F440C771b37718FAbf309cd527', 18],
      'LIBRA-ASTR-LP': ['0xA777570e710dba873D88B2d7DFbE28d9f9C4919e', 18], //DUMMY
      'LSHARE-ASTR-LP': ['0xFC3885887AF46A3f253d7bb3e3D992199C5AdaBC', 18], //DUMMY
      LBOND: ['0xa65Cb1745dda7C38d293bC100662f63841e64898', 18], // DUMMY
      LSHARE: ['0xC8393e1D77631B97548e9aa92546A4c8bf016413', 18], // DUMMY
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
