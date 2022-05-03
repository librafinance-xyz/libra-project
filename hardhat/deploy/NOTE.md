# Schedule

https://docs.librafinance.xyz/welcome-start-here/launch

day 1

- ASTR pool ( LIBRA reward )
  day 2-5
- close genesis pool
- open LIBRA-ASTR farm ( LIBRA reward )
  day 6-10
- LIBRA-ASTR farm ( LIBRA reward ) ( going on )
- LIBRA-ASTR farm ( LSHARE reward )
- LSHARE-ASTR farm ( LSHARE reward )
  day 11
- $LIBRA/$ASTR to get $LIBRA closed on Day 11
- $LSHARE stake (boardroom) open on Day11 ( for $LIBRA )
- $LIBRA/$ASTR to get $LSHARE
- $LSHARE/$ASTR to get $LSHARE

---

//
npx hardhat deploy --network fantom --tags Init
npx hardhat deploy --network fantom --tags LShare
npx hardhat deploy --network fantom --tags Oracle
npx hardhat deploy --network fantom --tags Pools
npx hardhat deploy --network fantom --tags LibraDistributeRewards
npx hardhat deploy --network fantom --tags LibraRewardPoolAdd
npx hardhat deploy --network fantom --tags PoolsAdd
npx hardhat deploy --network fantom --tags TreasuryInitilize
npx hardhat deploy --network fantom --tags LShareDistributeRewards
npx hardhat deploy --network fantom --tags BoardroomInitilize

//
npx hardhat deploy --network astar --tags Init
npx hardhat deploy --network astar --tags LShare
npx hardhat deploy --network astar --tags Oracle
npx hardhat deploy --network astar --tags Pools
npx hardhat deploy --network astar --tags LibraDistributeRewards
npx hardhat deploy --network astar --tags LibraRewardPoolAdd
npx hardhat deploy --network astar --tags PoolsAdd
npx hardhat deploy --network astar --tags TreasuryInitilize
npx hardhat deploy --network astar --tags LShareDistributeRewards
npx hardhat deploy --network astar --tags BoardroomInitilize
