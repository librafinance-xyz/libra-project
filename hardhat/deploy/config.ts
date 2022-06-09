import { Libra as LibraAddress } from "../../addresses/astar/Libra";
import { LShare as LShareAddress } from "../../addresses/astar/LShare";
import { LibraRewardPool as LibraRewardPool } from "../../addresses/astar/LibraRewardPool";
import { LibraGenesisRewardPool as LibraGenesisRewardPool } from "../../addresses/astar/LibraGenesisRewardPool";
import { Treasury as TreasuryAddress } from "../../addresses/astar/Treasury";
import { Boardroom as Boardroom } from "../../addresses/astar/Boardroom";
import { LBond as LBondAddress } from "../../addresses/astar/LBond";
import { Oracle as OracleAddress } from "../../addresses/astar/Oracle";


const genesisStartTime = 1654952400; // [TEST] Saturday, June 11, 2022 1:00:00 PM => [Production]  ?????????????????



// CHECK!!!
const startTimeLShare = genesisStartTime;
const startTimeLSharePool = genesisStartTime + 3600 * 12;  // [TEST]12 hours => [Production]  3600 * 24 * 5
// day 1
const poolStartTimeForLibraGenesisRewardPool = genesisStartTime;
// day 2-
const poolStartTimeForLibraRewardPool = genesisStartTime + 3600 * 12;  // [TEST]12 hours => [Production]  3600 * 24
const OraclePeriod = 3600; //
const OracleStartTime = genesisStartTime;
// CHECK !!!
const TraesuryStartTime = genesisStartTime;

const farmingIncentiveFund = "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7";
const LibraDeployConfig = {
  WETH: "0xAeaaf0e2c81Af264101B9129C00F4440cCF0F720", // WASTR
  UniswapV2Router: "0x13381C52765EaB0a2A132a79Cc27798ef80ca6A2", // LibraX
  UniswapV2Factory: "0xCEB861C2956FcF7d9b92e78c47Ad0075D458EeC5",// LibraX
  //
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
  communityFund: "0x08e4fd990A6Fc98FA110E824267c7e896aB7b0Af",
  devFund: "0x1Ec16347F61Ee8B3e5369A1A5e9a76Ede7A64AEA",
  treasuryFund: "0x9D388Ae1B93203eb293AD763FAda3c80A6042028",
  // Oracle
  LibraAddress: LibraAddress,
  //   LibraAstarPair: "",
  OraclePeriod: OraclePeriod,
  OracleStartTime: OracleStartTime,
  // Pools
  poolStartTimeForLibraGenesisRewardPool:
    poolStartTimeForLibraGenesisRewardPool,
  poolStartTimeForLibraRewardPool: poolStartTimeForLibraRewardPool,
  LShareAddress: LShareAddress,
  startTimeLSharePool: startTimeLSharePool,
  // LibraDistributeRewards
  LibraRewardPool: LibraRewardPool,
  LibraGenesisRewardPool: LibraGenesisRewardPool,
  Boardroom: Boardroom,
  AirdropWallet: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  // LShareDistributeRewards
  farmingIncentiveFund: farmingIncentiveFund,
  // TreasuryInitilize
  TreasuryAddress: TreasuryAddress,
  TraesuryStartTime: TraesuryStartTime,
  LBondAddress: LBondAddress,
  OracleAddress: OracleAddress,
};

export default LibraDeployConfig;
