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
    defaultProvider: 'https://astar.blastapi.io/a14986c5-535f-418d-91db-d1c6d632bfdc',
    
  
    //WSS: wss://astar-api.bwarelabs.com/ws/7d1b6401-caba-4a39-8a84-13d4e9f105b4

    deployments: require('./libra-finance/deployments/deployments.dev.json'),
    externalTokens: {
      USDC: ['0x6a2d262D56735DbA19Dd70682B39F6bE9a931D98', 6], // Astar USDC
      wASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      WASTR: ['0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720', 18],
      LIBRA: ['0x275d719111a7c6bfF2090BEa4B4C264852b774d2', 18], // DUMMY

      'ASTR-USDC-LP': ['0xBB1290c1829007F440C771b37718FAbf309cd527', 18],
      'LIBRA-ASTR-LP': ['0x2696Ad71eD72345110FC6E4CbEdc67B9B91A937A', 18], //DUMMY
      'LSHARE-ASTR-LP': ['0x0CbcE8d4580dA96b71C0B46215AFa4249325390d', 18], //DUMMY
      LBOND: ['0x6d416CE20C7E842eB00B01678Ac0E00Ab345618c', 18], // DUMMY
      LSHARE: ['0x79df379e6f70aA1b7311aAFf551315608336AcDD', 18], // DUMMY
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
    buyLink: 'https://librax.finance', //[LIBRA FINANCE]token address will be added
    sort: 1,
    closedForStaking: false,
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
    buyLink: 'https://librax.finance', //[LIBRA FINANCE]token address will be added
    site: '',
    sort: 2,
    closedForStaking: true,
  },

  LibraAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LIBRA-WASTR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'LibraAstarLPLShareRewardPool',
    depositTokenName: 'LIBRA-ASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '24000x',
    buyLink: 'https://librax.finance', //[LIBRA FINANCE]token address will be added
    site: '/',
    sort: 3,
    closedForStaking: false,
  },

  LshareAstarLPLShareRewardPool: {
    name: 'Earn LSHARE by LSHARE-WASTR LP',
    poolId: 1,
    sectionInUI: 2,
    contract: 'LshareAstarLPLShareRewardPool',
    depositTokenName: 'LSHARE-ASTR-LP',
    earnTokenName: 'LSHARE',
    finished: false,
    multiplier: '35500x',
    buyLink: 'https://www.librax.finance', //[LIBRA FINANCE]token address will be added
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
