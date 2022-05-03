// npx hardhat deploy --network astar --tags Init
// npx hardhat deploy --network fantom --tags Init

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

  // LIBRA ( DUMMY )
  const taxRate = "0";
  const taxCollectorAddress = "0x0000000000000000000000000000000000000000";
  const Libra = await mydeploy(
    hre,
    "LibraDummy",
    deployer,
    [taxRate, taxCollectorAddress],
    true,
    gasLimit
  );
  console.log("#Libra");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      Libra.address +
      " " +
      taxRate +
      " " +
      taxCollectorAddress +
      " " +
      " --contract contracts/mocks/LibraDummy.sol:LibraDummy "
  );

  const content = 'export const Libra = "' + Libra.address + '";' + "\n";
  fs.writeFileSync("../addresses/" + hre.network.name + "/Libra.ts", content);

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/Libra.ts",
    'export const Libra = "' + Libra.address + '";' + "\n"
  );

  // LBOND (Dummy )
  const LBond = await mydeploy(hre, "LBondDummy", deployer, [], true, gasLimit);
  console.log("#LBondDummy");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LBond.address +
      " " +
      " --contract contracts/mocks/LBondDummy.sol:LBondDummy "
  );

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/LBond.ts",
    'export const LBond = "' + LBond.address + '";' + "\n"
  );

  // Treasury
  const Treasury = await mydeploy(
    hre,
    "Treasury",
    deployer,
    [],
    true,
    gasLimit
  );
  console.log("#Treasury");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      Treasury.address +
      " " +
      " --contract contracts/Treasury.sol:Treasury "
  );

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/Treasury.ts",
    'export const Treasury = "' + Treasury.address + '";' + "\n"
  );

  // Boardroom
  const Boardroom = await mydeploy(
    hre,
    "Boardroom",
    deployer,
    [],
    true,
    gasLimit
  );
  console.log("#Boardroom");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      Boardroom.address +
      " " +
      " --contract contracts/Boardroom.sol:Boardroom "
  );

  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/Boardroom.ts",
    'export const Boardroom = "' + Boardroom.address + '";' + "\n"
  );
  // Boardroom.initialize(LibraDummy.address);

  // // LibraGenesisRewardPool
  // const poolStartTimeForLibraGenesisRewardPool = ""; // DAY 1
  // const poolStartTimeForLibraRewardPool = ""; // DAY 2-5 & Day 6-10
  // const LibraGenesisRewardPool = await mydeploy(
  //   hre,
  //   "LibraGenesisRewardPool",
  //   deployer,
  //   [LibraDummy.address, poolStartTimeForLibraGenesisRewardPool],
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
  //     " --contract contracts/distribution/LibraGenesisRewardPool.sol:LibraGenesisRewardPool "
  // );
  // const LibraRewardPool = await mydeploy(
  //   hre,
  //   "LibraRewardPool",
  //   deployer,
  //   [LibraDummy.address, poolStartTimeForLibraRewardPool],
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

func.tags = ["Init"];

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
