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
  startTime: "",
  startTimeLShare: "",
  communityFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  devFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  treasuryFund: "0x6eA8D23189aE68F1423c6Fc8f93b602B5C0524A7",
  // Oracle
  LibraAstarPair: "",
  OraclePeriod: "",
  OracleStartTime: "",
};

export default LibraDeployConfig;
