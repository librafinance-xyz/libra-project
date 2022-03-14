#!/bin/sh

npx hardhat flatten contracts/Tomb.sol > contracts_flatten/Tomb_flatten.sol 
npx hardhat flatten contracts/Tshare.sol > contracts_flatten/Tshare_flatten.sol 
npx hardhat flatten contracts/TBond.sol > contracts_flatten/TBond_flatten.sol 
npx hardhat flatten contracts/Oracle.sol > contracts_flatten/Oracle_flatten.sol 
npx hardhat flatten contracts/RebateTreasury.sol > contracts_flatten/RebateTreasury_flatten.sol 
npx hardhat flatten contracts/Treasury.sol > contracts_flatten/Treasury_flatten.sol 
npx hardhat flatten contracts/Masonry.sol > contracts_flatten/Masonry_flatten.sol 
