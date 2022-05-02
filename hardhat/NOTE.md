https://www.figma.com/file/tAYQLfuZGtWD7femZdV4GD/LIBRA-Finance-%E5%9B%B3%E8%A7%A3?node-id=0%3A1

https://www.figma.com/file/kfjY4fSwbFY70Tj8LIqZds/Untitled?node-id=0%3A1
Libra
constructor(uint256 \_taxRate, address \_taxCollectorAddress)

taxRate => 0
taxCollectorAddrsss =>0xc572bFeAd377554c75037991413123C1632C3107

solidity=0.6.12

DUMMY
https://blockscout.com/astar/address/0x6d664cfe0ce55bced5250b9cc3f04e98a239ef22/transactions

ABI: 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c572bfead377554c75037991413123c1632c3107

LBond

DUMMYBOND
https://blockscout.com/astar/address/0xe14beD310c733b6011785eA3728C31F2f017e71B/transactions

LShare
constructor(uint256 \_startTime, address \_communityFund, address \_devFund)

DUMMY-ASTR-LP: 0xf4E19B3960a3ae1c08209f7709BFe15D4E19470a
ーーーーーーーーここまで完了

Oracle

IUniswapV2Pair \_pair,
uint256 \_period,
uint256 \_startTime

\_pair=0xf4E19B3960a3ae1c08209f7709BFe15D4E19470a
\_period=300
\_startTime=1647668829

Masonry デプロイ

treasury デプロイ

function initialize(
address \_libra,
address \_lbond,
address \_lshare,
address \_libraOracle,
address \_masonry,
address \_genesisPool,
address \_bondTreasury,
uint256 \_startTime

RebateTreasury
constructor(address libra, address libraOracle, address treasury)

Masonry の initialize メソッドを叩く。
function initialize(
IERC20 \_libra,
IERC20 \_share,
ITreasury \_treasury

treasury の initialize をたたく。

function initialize(
address \_libra,
address \_lbond,
address \_lshare,
address \_libraOracle,
address \_masonry,
address \_genesisPool, => 要確認。
address \_bondTreasury, ＝＞ rebate treasury のこと？？要確認。
uint256 \_startTime
