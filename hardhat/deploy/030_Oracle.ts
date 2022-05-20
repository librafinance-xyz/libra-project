// npx hardhat deploy --network astar --tags Oracle

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

  // create LP.
  const UniswapV2Router = await ethers.getContractAt(
    UniswapV2RouterAbi,
    UniswapV2RouterAddress
  );
  const UniswapV2Factory = await ethers.getContractAt(
    UniswapV2FactoryAbi,
    UniswapV2FactoryAddress
  );
  const WASTR = await ethers.getContractAt(ERC20Abi, WastarAddress);
  const LIBRA = await ethers.getContractAt(ERC20Abi, LibraAddress);
  const LSHARE = await ethers.getContractAt(ERC20Abi, LShareAddress);
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
  console.log("LShareAstarPair: " + LShareAstarPair);
  console.log("LibraAstarPair: " + LibraAstarPair);
  if (
    LShareAstarPair == "0x0000000000000000000000000000000000000000" ||
    (await LShareAstarPairLP.balanceOf(deployer)) == 0
  ) {
    console.log("WASTR.approve...");
    await (
      await WASTR.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("LSHARE.approve...");
    await (
      await LSHARE.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("UniswapV2Router.addLiquidity...");

    await (
      await UniswapV2Router.addLiquidity(
        LShareAddress,
        WastarAddress,
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
      LShareAddress,
      WastarAddress
    );
  }
  if (
    LibraAstarPair == "0x0000000000000000000000000000000000000000" ||
    (await LibraAstarPairLP.balanceOf(deployer)) == 0
  ) {
    console.log("WASTR.approve...");
    await (
      await WASTR.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("LIBRA.approve...");
    await (
      await LIBRA.approve(UniswapV2RouterAddress, "100000000000000000")
    ).wait();
    console.log("UniswapV2Router.addLiquidity...");

    await (
      await UniswapV2Router.addLiquidity(
        LibraAddress,
        WastarAddress,
        "100000000000000000",
        "100000000000000000",
        "0",
        "0",
        deployer,
        "9999999999999"
      )
    ).wait();
    console.log("UniswapV2Factory.getPair...");

    LibraAstarPair = await UniswapV2Factory.getPair(
      LibraAddress,
      WastarAddress
    );
  }

  // const LibraAstarPair = LibraDeployConfig.LibraAstarPair;
  const OraclePeriod = LibraDeployConfig.OraclePeriod;
  const OracleStartTime = LibraDeployConfig.OracleStartTime;

  const Oracle = await mydeploy(
    hre,
    "Oracle",
    deployer,
    [LibraAstarPair, OraclePeriod, OracleStartTime],
    true,
    gasLimit
  );
  console.log("#Oracle");

  console.log(
    "npx hardhat verify --network " +
      hre.network.name +
      " " +
      Oracle.address+
      " " +
      LibraAstarPair +
      " " +
      OraclePeriod +
      " " +
      OracleStartTime +
      " " +
      " " +
      " --contract contracts/Oracle.sol:Oracle "
  );
  fs.writeFileSync(
    "../addresses/" + hre.network.name + "/Oracle.ts",
    'export const Oracle = "' + Oracle.address + '";' + "\n"
  );

  if (LibraAstarPair != "0x0000000000000000000000000000000000000000") {
    // LibraAstarPair
    fs.writeFileSync(
      "../addresses/" + hre.network.name + "/LibraAstarPair.ts",
      'export const LibraAstarPair = "' + LibraAstarPair + '";' + "\n"
    );
  }
  if (LShareAstarPair != "0x0000000000000000000000000000000000000000") {
    // LShareAstarPair
    fs.writeFileSync(
      "../addresses/" + hre.network.name + "/LShareAstarPair.ts",
      'export const LShareAstarPair = "' + LShareAstarPair + '";' + "\n"
    );
  }
};

func.tags = ["Oracle"];

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
