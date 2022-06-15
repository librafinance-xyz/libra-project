import { Libra as LibraAddress } from "../../addresses/astar/Libra";
import { LShare as LShareAddress } from "../../addresses/astar/LShare";
import { LibraRewardPool as LibraRewardPool } from "../../addresses/astar/LibraRewardPool";
import { LibraGenesisRewardPool as LibraGenesisRewardPool } from "../../addresses/astar/LibraGenesisRewardPool";
import { LShareRewardPool as LShareRewardPool } from "../../addresses/astar/LShareRewardPool";
import { Treasury as TreasuryAddress } from "../../addresses/astar/Treasury";
import { Boardroom as Boardroom } from "../../addresses/astar/Boardroom";
import { LBond as LBondAddress } from "../../addresses/astar/LBond";
import { Oracle as OracleAddress } from "../../addresses/astar/Oracle";


const genesisStartTime = 1655643600; // Sunday, June 19, 2022 1:00:00 PM GMT



// CHECK!!!
const startTimeLShare = genesisStartTime;
const startTimeLSharePool = genesisStartTime + 3600 * 24 * 5;  // DAY6-
// day 1
const poolStartTimeForLibraGenesisRewardPool = genesisStartTime;
// day 2-
const poolStartTimeForLibraRewardPool = genesisStartTime + 3600 * 24;  // DAY2-
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
  libraContractName: "Libra",
  libraContractPath: "contracts/Libra.sol",
  bondContractName: "LBond",
  bondContractPath: "contracts/LBond.sol",
  shareContractName: "LShare",
  shareContractPath: "contracts/LShare.sol",
  taxRate: "0",
  taxCollectorAddress: "0x0000000000000000000000000000000000000000",
  // LSHARE
  startTimeLShare: startTimeLShare,
  communityFund: "0x73d0FA805926a8A4fe2c05919E502D33bC18DDa6",
  devFund: "0x7C79e5D9fC47EfC922d44255AA7B35663e0B32ff",
  treasuryFund: "0x41804ad689907E795E3AB0F07f7789c059C05988",
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
  AirdropWallet: "0x87Db5Be7cFB11cB1B3E1eB3Dc83d2C3c7DdbF7F6", 
  // LShareDistributeRewards
  farmingIncentiveFund: LShareRewardPool,
  // TreasuryInitilize
  TreasuryAddress: TreasuryAddress,
  TraesuryStartTime: TraesuryStartTime,
  LBondAddress: LBondAddress,
  OracleAddress: OracleAddress,
};

export default LibraDeployConfig;
