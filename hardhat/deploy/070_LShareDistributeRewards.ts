// npx hardhat deploy --network astar --tags LShareDistributeRewards
// npx hardhat deploy --network fantom --tags LShareDistributeRewards

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import fs from "fs";
import LibraDeployConfig from "./config";
import UniswapV2RouterAbi from "./abi/UniswapV2Router.json";
import ERC20Abi from "./abi/erc20.json";
import { abi as LShareAbi } from "./abi/LShare.json";

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
  const LShareAddress = LibraDeployConfig.LShareAddress;
  const farmingIncentiveFund = LibraDeployConfig.farmingIncentiveFund;

  const LShare = await ethers.getContractAt(LShareAbi, LShareAddress);
  if ((await LShare.rewardPoolDistributed()) == false) {
    console.log("LShare reward pool distributing... ");
    await (
      await LShare.distributeReward(farmingIncentiveFund, {
        gasLimit: gasLimit,
      })
    ).wait();
  } else {
    console.log("LShare reward pool already ");
  }
  // const BoardroomAddress = LibraDeployConfig.Boardroom;
  // const LibraAddress = LibraDeployConfig.LibraAddress;
  // const TreasuryAddress = LibraDeployConfig.TreasuryAddress;
};

func.tags = ["LShareDistributeRewards"];

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
