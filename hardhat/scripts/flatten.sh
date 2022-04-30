#!/bin/sh


# npx hardhat flatten ./contracts/DummyToken.sol > ./contracts_flat/DummyToken.sol
# npx hardhat flatten ./contracts/Masonry.sol > ./contracts_flat/Masonry.sol
# npx hardhat flatten ./contracts/Oracle.sol > ./contracts_flat/Oracle.sol
# npx hardhat flatten ./contracts/RebateTreasury.sol >./contracts_flat/RebateTreasury.sol
# npx hardhat flatten ./contracts/TBond.sol >./contracts_flat/TBond.sol
# npx hardhat flatten ./contracts/Treasury.sol > ./contracts_flat/Treasury.sol
# npx hardhat flatten ./contracts/TShare.sol >./contracts_flat/TShare.sol
# npx hardhat flatten contracts/Tomb.sol > ./contracts_flat/Tomb.sol 

npx hardhat flatten contracts/DummyLibra.sol > ./contracts_flat/DummyLibra.sol 
npx hardhat flatten contracts/DummyLShare.sol > ./contracts_flat/DummyLShare.sol 
npx hardhat flatten contracts/DummyLBond.sol > ./contracts_flat/DummyLBond.sol 

npx hardhat flatten contracts/distribution/DummyLibraGenesisRewardPool.sol > ./contracts_flat/DummyLibraGenesisRewardPool.sol 
npx hardhat flatten contracts/distribution/DummyLibraRewardPool.sol > ./contracts_flat/DummyLibraRewardPool.sol 
npx hardhat flatten contracts/distribution/DummyLShareRewardPool.sol > ./contracts_flat/DummyLShareRewardPool.sol 

npx hardhat flatten contracts/DummyOracle.sol > ./contracts_flat/DummyOracle.sol 
npx hardhat flatten contracts/DummyBoardRoom.sol > ./contracts_flat/DummyBoardRoom.sol 
npx hardhat flatten contracts/DummyTreasury.sol > ./contracts_flat/DummyTreasury.sol 
npx hardhat flatten contracts/DummyRebateTreasury.sol > ./contracts_flat/DummyRebateTreasury.sol 
