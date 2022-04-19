// npx hardhat deploy --network astar --tags LibraDummy_LBondDummy

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

  // LIBRA
  const taxRate = "0";
  const taxCollectorAddress = "0x0000000000000000000000000000000000000000";
  const LibraDummy = await mydeploy(
    hre,
    "LibraDummy",
    deployer,
    [taxRate, taxCollectorAddress],
    true,
    gasLimit
  );
  console.log("#LibraDummy");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LibraDummy.address +
      " " +
      taxRate +
      " " +
      taxCollectorAddress +
      " " +
      " --contract contracts/mocks/LibraDummy.sol:LibraDummy "
  );
  // LBondDummy
  const LBondDummy = await mydeploy(
    hre,
    "LBondDummy",
    deployer,
    [],
    true,
    gasLimit
  );
  console.log("#LBondDummy");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LBondDummy.address +
      " " +
      " --contract contracts/mocks/LBondDummy.sol:LBondDummy "
  );
};

func.tags = ["LibraDummy_LBondDummy"];

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
