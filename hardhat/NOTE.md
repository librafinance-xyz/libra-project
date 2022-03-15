TBond

Tomb
constructor(uint256 \_taxRate, address \_taxCollectorAddress)
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
