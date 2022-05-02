#!/bin/sh


# npx hardhat flatten ./contracts/DummyToken.sol > ./contracts_flat/DummyToken.sol
# npx hardhat flatten ./contracts/Masonry.sol > ./contracts_flat/Masonry.sol
# npx hardhat flatten ./contracts/Oracle.sol > ./contracts_flat/Oracle.sol
# npx hardhat flatten ./contracts/RebateTreasury.sol >./contracts_flat/RebateTreasury.sol
# npx hardhat flatten ./contracts/LBond.sol >./contracts_flat/LBond.sol
# npx hardhat flatten ./contracts/Treasury.sol > ./contracts_flat/Treasury.sol
# npx hardhat flatten ./contracts/LShare.sol >./contracts_flat/LShare.sol
# npx hardhat flatten contracts/Libra.sol > ./contracts_flat/Libra.sol 

# npx hardhat flatten contracts/LibraDummy.sol > ./contracts_flat/LibraDummy.sol 
# npx hardhat flatten contracts/LShareDummy.sol > ./contracts_flat/LShareDummy.sol 
# npx hardhat flatten contracts/LBondDummy.sol > ./contracts_flat/LBondDummy.sol 

npx hardhat flatten contracts/distribution/LibraGenesisRewardPool.sol > ./contracts_flat/LibraGenesisRewardPool.sol 


