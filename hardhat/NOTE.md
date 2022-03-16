https://www.figma.com/file/tAYQLfuZGtWD7femZdV4GD/TOMB-Finance-%E5%9B%B3%E8%A7%A3?node-id=0%3A1

https://www.figma.com/file/kfjY4fSwbFY70Tj8LIqZds/Untitled?node-id=0%3A1

Tomb
constructor(uint256 \_taxRate, address \_taxCollectorAddress)

taxRate => 0
taxCollectorAddrsss =>たんなる EOA。

TBond

TShare
constructor(uint256 \_startTime, address \_communityFund, address \_devFund)

Oracle
IUniswapV2Pair \_pair,
uint256 \_period,
uint256 \_startTime

treasury
function initialize(
address \_tomb,
address \_tbond,
address \_tshare,
address \_tombOracle,
address \_masonry,
address \_genesisPool,
address \_bondTreasury,
uint256 \_startTime

RebateTreasury
constructor(address tomb, address tombOracle, address treasury) {

Masonry

    function initialize(
        IERC20 _tomb,
        IERC20 _share,
        ITreasury _treasury
