#!/bin/sh

npx hardhat flatten ./contracts/Boardroom.sol > ./contracts_flattend/Boardroom.sol
npx hardhat flatten ./contracts/Oracle.sol > ./contracts_flattend/Oracle.sol
npx hardhat flatten ./contracts/RebateTreasury.sol >./contracts_flattend/RebateTreasury.sol
npx hardhat flatten ./contracts/LBond.sol >./contracts_flattend/LBond.sol
npx hardhat flatten ./contracts/Treasury.sol > ./contracts_flattend/Treasury.sol
npx hardhat flatten ./contracts/LShare.sol >./contracts_flattend/LShare.sol
npx hardhat flatten ./contracts/Libra.sol > ./contracts_flattend/Libra.sol 
npx hardhat flatten ./contracts/distribution/LibraGenesisRewardPool.sol > ./contracts_flattend/LibraGenesisRewardPool.sol 
npx hardhat flatten ./contracts/distribution/LibraRewardPool.sol > ./contracts_flattend/LibraRewardPool.sol
npx hardhat flatten ./contracts/distribution/LShareRewardPool.sol > ./contracts_flattend/LShareRewardPool.sol

