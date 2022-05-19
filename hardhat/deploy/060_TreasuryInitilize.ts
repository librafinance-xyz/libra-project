// npx hardhat deploy --network astar --tags TreasuryInitilize

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import fs from "fs";
import LibraDeployConfig from "./config";
import UniswapV2RouterAbi from "./abi/UniswapV2Router.json";
import ERC20Abi from "./abi/erc20.json";
import { abi as TreasuryAbi } from "./abi/Treasury.json";
import { Boardroom } from "../../addresses/astar/Boardroom";

export async function mydeploy(
  hre: HardhatRuntimeEnvironment,
  contractName: string,
  from: string,
  args: any,
  log: boolean,
  gasLimit: number
) {
  console.log("mydeploy: " + contractName + "\n");
  await ethers.getContractFactory(contractName);
  const ret = await hre.deployments.deploy(contractName, {
    from: from,
    args: args,
    log: log,
    gasLimit: gasLimit,
  });
  return await ethers.getContractAt(ret.abi, ret.address);
}

const func: DeployFunction = async function (hre: HardhatRuntimeEnvironment) {
  console.log("\n\n\n\n\n\n\n start .... deployment \n\n\n\n\n ");
  console.log("hre.network.name = " + hre.network.name);

  const signers = await ethers.getSigners();

  const deployer = signers[0].address;
  const gasLimit = 5000000;
  console.log("deployer = " + deployer);
  const TreasuryAddress = LibraDeployConfig.TreasuryAddress;
  const LShareAddress = LibraDeployConfig.LShareAddress;
  const LBondAddress = LibraDeployConfig.LBondAddress;
  const LibraAddress = LibraDeployConfig.LibraAddress;
  const OracleAddress = LibraDeployConfig.OracleAddress;
  const LibraGenesisRewardPool = LibraDeployConfig.LibraGenesisRewardPool;
  const Boardroom = LibraDeployConfig.Boardroom;
  const TraesuryStartTime = LibraDeployConfig.TraesuryStartTime;
  console.log("TreasuryAddress: " + TreasuryAddress);

  const Treasury = await ethers.getContractAt(TreasuryAbi, TreasuryAddress);
  if ((await Treasury.initialized()) == false) {
    console.log("Treasury.initilize.....");
    await (
      await Treasury.initialize(
        LibraAddress,
        LBondAddress,
        LShareAddress,
        OracleAddress,
        Boardroom,
        LibraGenesisRewardPool,
        TraesuryStartTime,
        { gasLimit: gasLimit }
      )
    ).wait();
    console.log("Treasury.initilize.....ok");
  } else {
    console.log("Treasury alraedy initilized ");
  }
};

func.tags = ["TreasuryInitilize"];

func.skip = async (hre) => {
  return (
    hre.network.name !== "hardhat" &&
    hre.network.name !== "astar" &&
    hre.network.name !== "shiden" &&
    hre.network.name !== "fantomtest" &&
    hre.network.name !== "localhost" &&
    hre.network.name !== "mumbai" &&
    hre.network.name !== "fantom" &&
    hre.network.name !== "harmony" &&
    hre.network.name !== "harmonytest" &&
    hre.network.name !== "shibuya"
  );
};
export default func;
