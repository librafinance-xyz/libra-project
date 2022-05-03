// npx hardhat deploy --network astar --tags Pools
// npx hardhat deploy --network fantom --tags Pools

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import fs from "fs";
import LibraDeployConfig from "./config";
import UniswapV2RouterAbi from "./abi/UniswapV2Router.json";
import ERC20Abi from "./abi/erc20.json";

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

  // LibraGenesisRewardPool
  const poolStartTimeForLibraGenesisRewardPool =
    LibraDeployConfig.poolStartTimeForLibraGenesisRewardPool;
  // const poolStartTimeForLibraGenesisRewardPool = ""; // DAY 1
  const poolStartTimeForLibraRewardPool =
    LibraDeployConfig.poolStartTimeForLibraRewardPool;
  // const poolStartTimeForLibraRewardPool = ""; // DAY 2-5 & Day 6-10

  const LibraAddress = "";
  const LibraGenesisRewardPool = await mydeploy(
    hre,
    "LibraGenesisRewardPool",
    deployer,
    [LibraAddress, poolStartTimeForLibraGenesisRewardPool],
    true,
    gasLimit
  );
  console.log("#LibraGenesisRewardPool");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LibraGenesisRewardPool.address +
      " " +
      LibraAddress +
      " " +
      " " +
      poolStartTimeForLibraGenesisRewardPool +
      " " +
      " --contract contracts/distribution/LibraGenesisRewardPool.sol:LibraGenesisRewardPool "
  );

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/LibraGenesisRewardPool.ts",
    'export const LibraGenesisRewardPool = "' +
      LibraGenesisRewardPool.address +
      '";' +
      "\n"
  );

  const LibraRewardPool = await mydeploy(
    hre,
    "LibraRewardPool",
    deployer,
    [LibraAddress, poolStartTimeForLibraRewardPool],
    true,
    gasLimit
  );
  console.log("#LibraRewardPool");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LibraRewardPool.address +
      " " +
      LibraAddress +
      " " +
      " " +
      poolStartTimeForLibraRewardPool +
      " " +
      " --contract contracts/distribution/LibraRewardPool.sol:LibraRewardPool "
  );
  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/LibraRewardPool.ts",
    'export const LibraRewardPool = "' + LibraRewardPool.address + '";' + "\n"
  );
};

func.tags = ["Pools"];

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
