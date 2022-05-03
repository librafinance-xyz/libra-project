// npx hardhat deploy --network astar --tags LibraDistributeRewards
// npx hardhat deploy --network fantom --tags LibraDistributeRewards

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import fs from "fs";

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

  // // LibraGenesisRewardPool
  // const LibraAddress = "";
  // const poolStartTimeForLibraGenesisRewardPool = ""; // DAY 1
  // const poolStartTimeForLibraRewardPool = ""; // DAY 2-5 & Day 6-10
  // const LibraGenesisRewardPool = await mydeploy(
  //   hre,
  //   "LibraGenesisRewardPool",
  //   deployer,
  //   [LibraAddress, poolStartTimeForLibraGenesisRewardPool],
  //   true,
  //   gasLimit
  // );
  // console.log("#LibraGenesisRewardPool");
  // console.log(
  //   "npx hardhat verify --network " +
  //     hre.network.name +
  //     " " +
  //     LibraGenesisRewardPool.address +
  //     " " +
  //     LibraAddress +
  //     " " +
  //     " " +
  //     poolStartTimeForLibraGenesisRewardPool +
  //     " " +
  //     " --contract contracts/distribution/LibraGenesisRewardPool.sol:LibraGenesisRewardPool "
  // );
  // const LibraRewardPool = await mydeploy(
  //   hre,
  //   "LibraRewardPool",
  //   deployer,
  //   [LibraAddress, poolStartTimeForLibraRewardPool],
  //   true,
  //   gasLimit
  // );
  // console.log("#LibraRewardPool");
  // console.log(
  //   "npx hardhat verify --network " +
  //     hre.network.name +
  //     " " +
  //     LibraRewardPool.address +
  //     " " +
  //     LibraAddress +
  //     " " +
  //     " " +
  //     poolStartTimeForLibraRewardPool +
  //     " " +
  //     " --contract contracts/distribution/LibraRewardPool.sol:LibraRewardPool "
  // );

  // // LShare ( DUMMY )
  // const startTime = "";
  // const communityFund = "";
  // const devFund = "";
  // const treasuryFund = "";
  // const LShareDummy = await mydeploy(
  //   hre,
  //   "LShareDummy",
  //   deployer,
  //   [startTime, communityFund, devFund, treasuryFund],
  //   true,
  //   gasLimit
  // );
  // console.log("#LShareDummy");
  // console.log(
  //   "npx hardhat verify --network " +
  //     hre.network.name +
  //     " " +
  //     LShareDummy.address +
  //     " " +
  //     startTime +
  //     " " +
  //     communityFund +
  //     " " +
  //     devFund +
  //     " " +
  //     treasuryFund +
  //     " " +
  //     " --contract contracts/mocks/LShareDummy.sol:LShareDummy "
  // );
};

func.tags = ["LibraDistributeRewards"];

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
