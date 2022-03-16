#!/bin/sh


npx hardhat flatten ./contracts/DummyToken.sol > ./contracts_flattend/DummyToken.sol
npx hardhat flatten ./contracts/Masonry.sol > ./contracts_flattend/Masonry.sol
npx hardhat flatten ./contracts/Oracle.sol > ./contracts_flattend/Oracle.sol
npx hardhat flatten ./contracts/RebateTreasury.sol >./contracts_flattend/RebateTreasury.sol
npx hardhat flatten ./contracts/TBond.sol >./contracts_flattend/TBond.sol
npx hardhat flatten ./contracts/Treasury.sol > ./contracts_flattend/Treasury.sol
npx hardhat flatten ./contracts/TShare.sol >./contracts_flattend/TShare.sol
