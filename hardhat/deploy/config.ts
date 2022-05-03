import { Libra as LibraAddress } from "../../addresses/astar/Libra";
import { LibraRewardPool as LibraRewardPool } from "../../addresses/astar/LibraRewardPool";
import { LibraGenesisRewardPool as LibraGenesisRewardPool } from "../../addresses/astar/LibraGenesisRewardPool";

const genesisStartTime = 1651572000; // Tue May 03 2022 10:00:00 GMT+0000, Tue May 03 2022 14:00:00 GMT+0400 (湾岸標準時)
const startTimeLShare = genesisStartTime;
// day 1
const poolStartTimeForLibraGenesisRewardPool = genesisStartTime;
// day 2-
const poolStartTimeForLibraRewardPool = genesisStartTime + 3600 * 24;
const OraclePeriod = 3600; // but usualy we should setup 3600 * 6 ;
const OracleStartTime = genesisStartTime;
const LibraDeployConfig = {
  WETH: "0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720",
  UniswapV2Router: "0x92E4d13366C40Ad95D5bB396Beb1891F701CD85F",
  UniswapV2Factory: "0x3e01891B309c29E441783F5A2C8CB7833D9b78ff",

  //INIT
  libraContractName: "LibraDummy",
  libraContractPath: "contracts/mocks/LibraDummy.sol",
  bondContractName: "LBondDummy",
  bondContractPath: "contracts/mocks/LBondDummy.sol",
  shareContractName: "LibraDummy",
  shareContractPath: "contracts/mocks/LibraDummy.sol",
  taxRate: "0",
  taxCollectorAddress: "0x0000000000000000000000000000000000000000",
  // LSHARE
  startTimeLShare: startTimeLShare,
  communityFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  devFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  treasuryFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  // Oracle
  LibraAddress: LibraAddress,
  //   LibraAstarPair: "",
  OraclePeriod: OraclePeriod,
  OracleStartTime: OracleStartTime,
  // Pools
  poolStartTimeForLibraGenesisRewardPool:
    poolStartTimeForLibraGenesisRewardPool,
  poolStartTimeForLibraRewardPool: poolStartTimeForLibraRewardPool,

  // LibraDistributeRewards
  LibraRewardPool: LibraRewardPool,
  LibraGenesisRewardPool: LibraRewardPool,
  AirdropWallet: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
};

export default LibraDeployConfig;
