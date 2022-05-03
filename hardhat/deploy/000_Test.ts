// npx hardhat deploy --network astar --tags Test

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import LibraDeployConfig from "./config";
import UniswapV2FactoryAbi from "./abi/UniswapV2Factory.json";
import UniswapV2RouterAbi from "./abi/UniswapV2Router.json";
import ERC20Abi from "./abi/erc20.json";

import fs from "fs";
import { Libra } from "../../addresses/astar/Libra";
import { LShare } from "../../addresses/astar/LShare";

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
  const UniswapV2RouterAddress = LibraDeployConfig.UniswapV2Router;
  const UniswapV2FactoryAddress = LibraDeployConfig.UniswapV2Factory;
  const WastarAddress = LibraDeployConfig.WETH;
  const LibraAddress = LibraDeployConfig.LibraAddress;
  const LShareAddress = LibraDeployConfig.LShareAddress;
  const LBondAddress = LibraDeployConfig.LBondAddress;

  const UniswapV2Router = await ethers.getContractAt(
    UniswapV2RouterAbi,
    UniswapV2RouterAddress
  );
  const UniswapV2Factory = await ethers.getContractAt(
    UniswapV2FactoryAbi,
    UniswapV2FactoryAddress
  );
};

func.tags = ["Test"];

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
