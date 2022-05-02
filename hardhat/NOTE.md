https://www.figma.com/file/tAYQLfuZGtWD7femZdV4GD/TOMB-Finance-%E5%9B%B3%E8%A7%A3?node-id=0%3A1

https://www.figma.com/file/kfjY4fSwbFY70Tj8LIqZds/Untitled?node-id=0%3A1
Tomb
constructor(uint256 \_taxRate, address \_taxCollectorAddress)

taxRate => 0
taxCollectorAddrsss =>0xc572bFeAd377554c75037991413123C1632C3107

solidity=0.6.12

DUMMY
https://blockscout.com/astar/address/0x09679d9DfA42146115988C6A84FEe0933D53b313/transactions

ABI: 0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000c572bfead377554c75037991413123c1632c3107

TBond

DUMMYBOND
https://blockscout.com/astar/address/0x5508C3b4598D0a80a20EFD45d12717b8De4ad723/transactions

TShare
constructor(uint256 \_startTime, address \_communityFund, address \_devFund)

DUMMY-ASTR-LP: 0xF3C8aC387E2254b92C0edD5e8307373099e394c6
ーーーーーーーーここまで完了

Oracle

IUniswapV2Pair \_pair,
uint256 \_period,
uint256 \_startTime

\_pair=0xF3C8aC387E2254b92C0edD5e8307373099e394c6
\_period=300
\_startTime=1647668829

Boardroom deployed

treasury deployed

LibraGenesisRewardPool deployed


RebateTreasury
constructor(address tomb, address tombOracle, address treasury)

--In Progress--

function initialize(
address \_tomb,
address \_tbond,
address \_tshare,
address \_tombOracle,
address \_masonry,
address \_genesisPool,
address \_bondTreasury, ＝＞ rebate treasury のこと？？要確認
uint256 \_startTime



Masonry の initialize メソッドを叩く。
function initialize(
IERC20 \_tomb,
IERC20 \_share,
ITreasury \_treasury

treasury の initialize をたたく。

function initialize(
address \_tomb,
address \_tbond,
address \_tshare,
address \_tombOracle,
address \_masonry,
address \_genesisPool, => 要確認。
address \_bondTreasury, ＝＞ rebate treasury のこと？？要確認。
uint256 \_startTime
