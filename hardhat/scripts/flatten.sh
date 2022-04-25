#!/bin/sh


# npx hardhat flatten ./contracts/DummyToken.sol > ./contracts_flat/DummyToken.sol
# npx hardhat flatten ./contracts/Masonry.sol > ./contracts_flat/Masonry.sol
# npx hardhat flatten ./contracts/Oracle.sol > ./contracts_flat/Oracle.sol
# npx hardhat flatten ./contracts/RebateTreasury.sol >./contracts_flat/RebateTreasury.sol
# npx hardhat flatten ./contracts/TBond.sol >./contracts_flat/TBond.sol
# npx hardhat flatten ./contracts/Treasury.sol > ./contracts_flat/Treasury.sol
# npx hardhat flatten ./contracts/TShare.sol >./contracts_flat/TShare.sol
# npx hardhat flatten contracts/Tomb.sol > ./contracts_flat/Tomb.sol 

# npx hardhat flatten contracts/TombDummy.sol > ./contracts_flat/TombDummy.sol 
# npx hardhat flatten contracts/TShareDummy.sol > ./contracts_flat/TShareDummy.sol 
# npx hardhat flatten contracts/TBondDummy.sol > ./contracts_flat/TBondDummy.sol 

npx hardhat flatten contracts/distribution/LibraGenesisRewardPool.sol > ./contracts_flat/LibraGenesisRewardPool.sol 


