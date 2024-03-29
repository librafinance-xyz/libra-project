// npx hardhat deploy --network astar --tags Pools2

import { ethers } from "hardhat";
import { HardhatRuntimeEnvironment } from "hardhat/types";
import { DeployFunction } from "hardhat-deploy/types";

import fs from "fs";
import LibraDeployConfig from "./config";
import UniswapV2RouterAbi from "./abi/UniswapV2Router.json";
import ERC20Abi from "./abi/erc20.json";
import UniswapV2FactoryAbi from "./abi/UniswapV2Factory.json";
import { Libra } from "../../addresses/astar/Libra";

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
  console.log("deployer = " + deployer);
  const WASTRAddress = LibraDeployConfig.WETH;

  // LibraGenesisRewardPool
  const poolStartTimeForLibraGenesisRewardPool =
    LibraDeployConfig.poolStartTimeForLibraGenesisRewardPool;
  // const poolStartTimeForLibraGenesisRewardPool = ""; // DAY 1
  const poolStartTimeForLibraRewardPool =
    LibraDeployConfig.poolStartTimeForLibraRewardPool;
  const LibraAddress = LibraDeployConfig.LibraAddress;
  const UniswapV2FactoryAddress = LibraDeployConfig.UniswapV2Factory;
  const UniswapV2RouterAddress = LibraDeployConfig.UniswapV2Router;
  const communityFund = LibraDeployConfig.communityFund;

  // // const poolStartTimeForLibraRewardPool = ""; // DAY 2-5 & Day 6-10
  // //////////////////////////////////////////////////////////////////////////////////////////
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

  // fs.writeFileSync(
  //   "../addresses/" + hre.network.name + "/LibraGenesisRewardPool.ts",
  //   'export const LibraGenesisRewardPool = "' +
  //     LibraGenesisRewardPool.address +
  //     '";' +
  //     "\n"
  // );

  // // console.log(
  // //   "LibraGenesisRewardPool.poolInfo(0): " +
  // //     (await LibraGenesisRewardPool.poolInfo(0))
  // // );
  // // console.log(
  // //   "LibraGenesisRewardPool.poolInfo(0): " +
  // //     (await LibraGenesisRewardPool.poolInfo(0).token)
  // // );

  // // console.log(
  // //   "LibraGenesisRewardPool.poolInfo(0): " +
  // //     (await LibraGenesisRewardPool.poolInfo(0))
  // // );
  // if ((await LibraGenesisRewardPool.totalAllocPoint()) == 0) {
  //   //
  //   await (
  //     await LibraGenesisRewardPool.add("100", WASTRAddress, false, 0)
  //   ).wait();
  // }

  // //////////////////////////////////////////////////////////////////////////////////////////
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
  // fs.writeFileSync(
  //   "../addresses/" + hre.network.name + "/LibraRewardPool.ts",
  //   'export const LibraRewardPool = "' + LibraRewardPool.address + '";' + "\n"
  // );

  // console.log(
  //   "LibraRewardPool.totalAllocPoint()): " +
  //     (await LibraRewardPool.totalAllocPoint())
  // );

  // if ((await LibraRewardPool.totalAllocPoint()) == 0) {
  //   //
  //   await (await LibraRewardPool.add("100", LibraAstarPair, false, 0)).wait();
  // }

  //////////////////////////////
  const LShareAddress = LibraDeployConfig.LShareAddress;
  const startTimeLSharePool = LibraDeployConfig.startTimeLSharePool;
  // const gasLimit = 1400000;
  // const gasLimit = 3000000;
  const gasLimit = 5000000;

  console.log("LShareAddress: " + LShareAddress);
  console.log("startTimeLSharePool: " + startTimeLSharePool);
  const LShareRewardPool = await mydeploy(
    hre,
    "LShareRewardPool",
    deployer,
    [LShareAddress, communityFund, startTimeLSharePool],
    true,
    gasLimit
  );
  console.log("#LShareRewardPool");
  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      LShareRewardPool.address +
      " " +
      LShareAddress +
      " " +
      " " +
      startTimeLSharePool +
      " " +
      " --contract contracts/distribution/LShareRewardPool.sol:LShareRewardPool "
  );
  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/LShareRewardPool.ts",
    'export const LShareRewardPool = "' + LShareRewardPool.address + '";' + "\n"
  );

  const UniswapV2Factory = await ethers.getContractAt(
    UniswapV2FactoryAbi,
    UniswapV2FactoryAddress
  );

  // console.log("UniswapV2FactoryAbi: " + UniswapV2FactoryAbi);
  console.log("UniswapV2FactoryAddress: " + UniswapV2FactoryAddress);
  console.log("LibraAddress: " + LibraAddress);
  console.log("WASTRAddress: " + WASTRAddress);
  const LIBRA = await ethers.getContractAt(ERC20Abi, LibraAddress);
  const WASTR = await ethers.getContractAt(ERC20Abi, WASTRAddress);
  console.log("LIBRA: " + (await LIBRA.balanceOf(deployer)));
  console.log("WASTR: " + (await WASTR.balanceOf(deployer)));

  const LibraAstarPair = await UniswapV2Factory.getPair(
    WASTRAddress,
    LibraAddress
  );

  console.log("UniswapV2FactoryAddress: " + UniswapV2FactoryAddress);
  console.log("LibraAddress: " + LibraAddress);
  console.log("LibraAstarPair: " + LibraAstarPair);
  console.log("WASTRAddress: " + WASTRAddress);

  console.log("LibraAstarPair: " + LibraAstarPair);

  let LShareAstarPair = await UniswapV2Factory.getPair(
    LShareAddress,
    WASTRAddress
  );

  console.log("LShareAstarPair: " + LShareAstarPair);

  console.log(
    "LShareRewardPool.totalAllocPoint(): " +
      (await LShareRewardPool.totalAllocPoint())
  );
  const LShareAstarLP = await ethers.getContractAt(ERC20Abi, LShareAstarPair);

  if (
    LShareAstarPair == "0x0000000000000000000000000000000000000000" ||
    (await LShareAstarLP.balanceOf(deployer)) == 0
  ) {
    const WASTR = await ethers.getContractAt(ERC20Abi, WASTRAddress);
    const LShare = await ethers.getContractAt(ERC20Abi, LShareAddress);
    console.log("WASTR.approve...");
    await (
      await WASTR.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("LShare.approve...");
    await (
      await LShare.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("UniswapV2Router.addLiquidity...");
    const UniswapV2Router = await ethers.getContractAt(
      UniswapV2RouterAbi,
      UniswapV2RouterAddress
    );
    await (
      await UniswapV2Router.addLiquidity(
        LShareAddress,
        WASTRAddress,
        "100000000000000000",
        "100000000000000000",
        "0",
        "0",
        deployer,
        "9999999999999"
      )
    ).wait();

    console.log("UniswapV2Factory.getPair...");
    LShareAstarPair = await UniswapV2Factory.getPair(
      LibraAddress,
      WASTRAddress
    );
  }
  if ((await LShareRewardPool.totalAllocPoint()) == 0) {
    //
    console.log("LShareRewardPool.add.. LibraAstarPair = " + LibraAstarPair);
    await (await LShareRewardPool.add("27300", LibraAstarPair, false, 0)).wait();
    console.log("LShareRewardPool.add.. LShareAstarPair = " + LShareAstarPair);
    await (await LShareRewardPool.add("18200", LShareAstarPair, false, 0)).wait();
  } else {
  }
};

func.tags = ["Pools2"];

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
