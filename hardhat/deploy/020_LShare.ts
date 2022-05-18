// npx hardhat deploy --network astar --tags LShare

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";
import LibraDeployConfig from "./config";

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

  // LShare ( DUMMY )
  const startTimeLShare = LibraDeployConfig.startTimeLShare;
  const communityFund = LibraDeployConfig.communityFund;
  const devFund = LibraDeployConfig.devFund;
  const treasuryFund = LibraDeployConfig.treasuryFund;

  const LShare = await mydeploy(
    hre,
    "LShareDummy",
    deployer,
    [startTimeLShare, communityFund, devFund, treasuryFund],
    true,
    gasLimit
  );
  console.log("#LShare");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LShare.address +
      " " +
      startTimeLShare +
      " " +
      communityFund +
      " " +
      devFund +
      " " +
      treasuryFund +
      " " +
      " --contract contracts/mocks/LShareDummy.sol:LShareDummy "
  );

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/LShare.ts",
    'export const LShare = "' + LShare.address + '";' + "\n"
  );
};

func.tags = ["LShare"];

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
