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
  console.log("UniswapV2RouterAddress: " + UniswapV2RouterAddress);
  console.log("UniswapV2FactoryAddress: " + UniswapV2FactoryAddress);

  const WASTR = await ethers.getContractAt(ERC20Abi, WastarAddress);
  const LIBRA = await ethers.getContractAt(ERC20Abi, LibraAddress);
  const LSHARE = await ethers.getContractAt(ERC20Abi, LShareAddress);
  const LBOND = await ethers.getContractAt(ERC20Abi, LBondAddress);
  let LibraAstarPair = "";
  let LShareAstarPair = "";
  LibraAstarPair = await UniswapV2Factory.getPair(LibraAddress, WastarAddress);
  LShareAstarPair = await UniswapV2Factory.getPair(
    LShareAddress,
    WastarAddress
  );
  const LibraAstarPairLP = await ethers.getContractAt(ERC20Abi, LibraAstarPair);
  const LShareAstarPairLP = await ethers.getContractAt(
    ERC20Abi,
    LShareAstarPair
  );
  console.log("UniswapV2Router.removeLiquidity....");

  if ((await LibraAstarPairLP.balanceOf(deployer)) > 0) {
    const bal = await LibraAstarPairLP.balanceOf(deployer);
    console.log("bal: " + bal);
    console.log("UniswapV2Router.removeLiquidity....");

    await (
      await UniswapV2Router.removeLiquidityETHSupportingFeeOnTransferTokens(
        LibraAddress,
        // WastarAddress,
        bal.div(3).toString(),
        0,
        0,
        deployer,
        "9999999999999",
        { gasLimit: gasLimit }
      )
    ).wait();

    // await (
    //   await UniswapV2Router.removeLiquidity(
    //     LibraAddress,
    //     WastarAddress,
    //     bal.div(3).toString(),
    //     0,
    //     0,
    //     deployer,
    //     "9999999999999",
    //     { gasLimit: gasLimit }
    //   )
    // ).wait();
    console.log("UniswapV2Router.removeLiquidity....ok ");
  }
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
