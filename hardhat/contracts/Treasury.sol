// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/Math.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "@openzeppelin/contracts/utils/ReentrancyGuard.sol";

import "./lib/Babylonian.sol";
import "./owner/Operator.sol";
import "./utils/ContractGuard.sol";
import "./interfaces/IBasisAsset.sol";
import "./interfaces/IOracle.sol";
import "./interfaces/IBoardroom.sol";

interface IBondTreasury {
    function totalVested() external view returns (uint256);
}

contract Treasury is ContractGuard {
    using SafeERC20 for IERC20;
    using Address for address;
    using SafeMath for uint256;

    /* ========= CONSTANT VARIABLES ======== */

    uint256 public constant PERIOD = 6 hours;

    /* ========== STATE VARIABLES ========== */

    // governance
    address public operator;

    // flags
    bool public initialized = false;

    // epoch
    uint256 public startTime;
    uint256 public epoch = 0;
    uint256 public epochSupplyContractionLeft = 0;

    // exclusions from total supply
    address[] public excludedFromTotalSupply;

    // core components
    address public libra;
    address public lbond;
    address public lshare;

    address public boardroom;
    address public bondTreasury;
    address public libraOracle;

    // price
    uint256 public libraPriceOne;
    uint256 public libraPriceCeiling;

    uint256 public seigniorageSaved;

    uint256[] public supplyTiers;
    uint256[] public maxExpansionTiers;

    uint256 public maxSupplyExpansionPercent;
    uint256 public bondDepletionFloorPercent;
    uint256 public seigniorageExpansionFloorPercent;
    uint256 public maxSupplyContractionPercent;
    uint256 public maxDebtRatioPercent;

    uint256 public bondSupplyExpansionPercent;

    // 28 first epochs (1 week) with 4.5% expansion regardless of LIBRA price
    uint256 public bootstrapEpochs;
    uint256 public bootstrapSupplyExpansionPercent;

    /* =================== Added variables =================== */
    uint256 public previousEpochLibraPrice;
    uint256 public maxDiscountRate; // when purchasing bond
    uint256 public maxPremiumRate; // when redeeming bond
    uint256 public discountPercent;
    uint256 public premiumThreshold;
    uint256 public premiumPercent;
    uint256 public mintingFactorForPayingDebt; // print extra LIBRA during debt phase

    address public daoFund;
    uint256 public daoFundSharedPercent;

    address public devFund;
    uint256 public devFundSharedPercent;

    address public insuranceFund;
    uint256 public insuranceFundSharedPercent;

    /* =================== Events =================== */

    event Initialized(address indexed executor, uint256 at);
    event BurnedBonds(address indexed from, uint256 bondAmount);
    event RedeemedBonds(address indexed from, uint256 libraAmount, uint256 bondAmount);
    event BoughtBonds(address indexed from, uint256 libraAmount, uint256 bondAmount);
    event TreasuryFunded(uint256 timestamp, uint256 seigniorage);
    event BoardroomFunded(uint256 timestamp, uint256 seigniorage);
    event DaoFundFunded(uint256 timestamp, uint256 seigniorage);
    event DevFundFunded(uint256 timestamp, uint256 seigniorage);
    event InsuranceFundFunded(uint256 timestamp, uint256 seigniorage);

    /* =================== Modifier =================== */

    modifier onlyOperator() {
        require(operator == msg.sender, "Treasury: caller is not the operator");
        _;
    }

    modifier checkCondition {
        require(now >= startTime, "Treasury: not started yet");

        _;
    }

    modifier checkEpoch {
        require(now >= nextEpochPoint(), "Treasury: not opened yet");

        _;

        epoch = epoch.add(1);
        epochSupplyContractionLeft = (getLibraPrice() > libraPriceCeiling) ? 0 : getLibraCirculatingSupply().mul(maxSupplyContractionPercent).div(10000);
    }

    modifier checkOperator {
        require(
            IBasisAsset(libra).operator() == address(this) &&
                IBasisAsset(lbond).operator() == address(this) &&
                IBasisAsset(lshare).operator() == address(this) &&
                Operator(boardroom).operator() == address(this),
            "Treasury: need more permission"
        );

        _;
    }

    modifier notInitialized {
        require(!initialized, "Treasury: already initialized");

        _;
    }

    /* ========== VIEW FUNCTIONS ========== */

    function isInitialized() public view returns (bool) {
        return initialized;
    }

    // epoch
    function nextEpochPoint() public view returns (uint256) {
        return startTime.add(epoch.mul(PERIOD));
    }

    // oracle
    function getLibraPrice() public view returns (uint256 libraPrice) {
        try IOracle(libraOracle).consult(libra, 1e18) returns (uint144 price) {
            return uint256(price);
        } catch {
            revert("Treasury: failed to consult LIBRA price from the oracle");
        }
    }

    function getLibraUpdatedPrice() public view returns (uint256 _libraPrice) {
        try IOracle(libraOracle).twap(libra, 1e18) returns (uint144 price) {
            return uint256(price);
        } catch {
            revert("Treasury: failed to consult LIBRA price from the oracle");
        }
    }

    // budget
    function getReserve() public view returns (uint256) {
        return seigniorageSaved;
    }

    function getBurnableLibraLeft() public view returns (uint256 _burnableLibraLeft) {
        uint256 _libraPrice = getLibraPrice();
        if (_libraPrice <= libraPriceOne) {
            uint256 _libraSupply = getLibraCirculatingSupply();
            uint256 _bondMaxSupply = _libraSupply.mul(maxDebtRatioPercent).div(10000);
            uint256 _bondSupply = IERC20(lbond).totalSupply();
            if (_bondMaxSupply > _bondSupply) {
                uint256 _maxMintableBond = _bondMaxSupply.sub(_bondSupply);
                uint256 _maxBurnableLibra = _maxMintableBond.mul(_libraPrice).div(1e18);
                _burnableLibraLeft = Math.min(epochSupplyContractionLeft, _maxBurnableLibra);
            }
        }
    }

    function getRedeemableBonds() public view returns (uint256 _redeemableBonds) {
        uint256 _libraPrice = getLibraPrice();
        if (_libraPrice > libraPriceCeiling) {
            uint256 _totalLibra = IERC20(libra).balanceOf(address(this));
            uint256 _rate = getBondPremiumRate();
            if (_rate > 0) {
                _redeemableBonds = _totalLibra.mul(1e18).div(_rate);
            }
        }
    }

    function getBondDiscountRate() public view returns (uint256 _rate) {
        uint256 _libraPrice = getLibraPrice();
        if (_libraPrice <= libraPriceOne) {
            if (discountPercent == 0) {
                // no discount
                _rate = libraPriceOne;
            } else {
                uint256 _bondAmount = libraPriceOne.mul(1e18).div(_libraPrice); // to burn 1 LIBRA
                uint256 _discountAmount = _bondAmount.sub(libraPriceOne).mul(discountPercent).div(10000);
                _rate = libraPriceOne.add(_discountAmount);
                if (maxDiscountRate > 0 && _rate > maxDiscountRate) {
                    _rate = maxDiscountRate;
                }
            }
        }
    }

    function getBondPremiumRate() public view returns (uint256 _rate) {
        uint256 _libraPrice = getLibraPrice();
        if (_libraPrice > libraPriceCeiling) {
            uint256 _libraPricePremiumThreshold = libraPriceOne.mul(premiumThreshold).div(100);
            if (_libraPrice >= _libraPricePremiumThreshold) {
                //Price > 1.10
                uint256 _premiumAmount = _libraPrice.sub(libraPriceOne).mul(premiumPercent).div(10000);
                _rate = libraPriceOne.add(_premiumAmount);
                if (maxPremiumRate > 0 && _rate > maxPremiumRate) {
                    _rate = maxPremiumRate;
                }
            } else {
                // no premium bonus
                _rate = libraPriceOne;
            }
        }
    }

    /* ========== GOVERNANCE ========== */

    function initialize(
        address _libra,
        address _lbond,
        address _lshare,
        address _libraOracle,
        address _boardroom,
        address _genesisPool,
        address _bondTreasury,
        uint256 _startTime
    ) public notInitialized {
        libra = _libra;
        lbond = _lbond;
        lshare = _lshare;
        libraOracle = _libraOracle;
        boardroom = _boardroom;
        bondTreasury = _bondTreasury;
        startTime = _startTime;

        libraPriceOne = 10**18;
        libraPriceCeiling = libraPriceOne.mul(101).div(100);

        // exclude contracts from total supply
        excludedFromTotalSupply.push(_genesisPool);
        excludedFromTotalSupply.push(_bondTreasury);

        // Dynamic max expansion percent
        supplyTiers = [0 ether, 500000 ether, 1000000 ether, 1500000 ether, 2000000 ether, 5000000 ether, 10000000 ether, 20000000 ether, 50000000 ether];
        maxExpansionTiers = [450, 400, 350, 300, 250, 200, 150, 125, 100];

        maxSupplyExpansionPercent = 400; // Upto 4.0% supply for expansion

        bondDepletionFloorPercent = 10000; // 100% of Bond supply for depletion floor
        seigniorageExpansionFloorPercent = 3500; // At least 35% of expansion reserved for boardroom
        maxSupplyContractionPercent = 300; // Upto 3.0% supply for contraction (to burn LIBRA and mint LBOND)
        maxDebtRatioPercent = 3500; // Upto 35% supply of LBOND to purchase

        bondSupplyExpansionPercent = 500; // maximum 5% emissions per epoch for POL bonds

        premiumThreshold = 110;
        premiumPercent = 7000;

        // First 12 epochs with 5% expansion
        bootstrapEpochs = 12;
        bootstrapSupplyExpansionPercent = 500;

        // set seigniorageSaved to it's balance
        seigniorageSaved = IERC20(libra).balanceOf(address(this));

        initialized = true;
        operator = msg.sender;
        emit Initialized(msg.sender, block.number);
    }

    function setOperator(address _operator) external onlyOperator {
        operator = _operator;
    }

    function setBoardroom(address _boardroom) external onlyOperator {
        boardroom = _boardroom;
    }

    function setBondTreasury(address _bondTreasury) external onlyOperator {
        bondTreasury = _bondTreasury;
    }

    function setLibraOracle(address _libraOracle) external onlyOperator {
        libraOracle = _libraOracle;
    }

    function setLibraPriceCeiling(uint256 _libraPriceCeiling) external onlyOperator {
        require(_libraPriceCeiling >= libraPriceOne && _libraPriceCeiling <= libraPriceOne.mul(120).div(100), "out of range"); // [$1.0, $1.2]
        libraPriceCeiling = _libraPriceCeiling;
    }

    function setMaxSupplyExpansionPercents(uint256 _maxSupplyExpansionPercent) external onlyOperator {
        require(_maxSupplyExpansionPercent >= 10 && _maxSupplyExpansionPercent <= 1000, "_maxSupplyExpansionPercent: out of range"); // [0.1%, 10%]
        maxSupplyExpansionPercent = _maxSupplyExpansionPercent;
    }

    function setSupplyTiersEntry(uint8 _index, uint256 _value) external onlyOperator returns (bool) {
        require(_index >= 0, "Index has to be higher than 0");
        require(_index < 9, "Index has to be lower than count of tiers");
        if (_index > 0) {
            require(_value > supplyTiers[_index - 1]);
        }
        if (_index < 8) {
            require(_value < supplyTiers[_index + 1]);
        }
        supplyTiers[_index] = _value;
        return true;
    }

    function setMaxExpansionTiersEntry(uint8 _index, uint256 _value) external onlyOperator returns (bool) {
        require(_index >= 0, "Index has to be higher than 0");
        require(_index < 9, "Index has to be lower than count of tiers");
        require(_value >= 10 && _value <= 1000, "_value: out of range"); // [0.1%, 10%]
        maxExpansionTiers[_index] = _value;
        return true;
    }

    function setBondDepletionFloorPercent(uint256 _bondDepletionFloorPercent) external onlyOperator {
        require(_bondDepletionFloorPercent >= 500 && _bondDepletionFloorPercent <= 10000, "out of range"); // [5%, 100%]
        bondDepletionFloorPercent = _bondDepletionFloorPercent;
    }

    function setMaxSupplyContractionPercent(uint256 _maxSupplyContractionPercent) external onlyOperator {
        require(_maxSupplyContractionPercent >= 100 && _maxSupplyContractionPercent <= 1500, "out of range"); // [0.1%, 15%]
        maxSupplyContractionPercent = _maxSupplyContractionPercent;
    }

    function setMaxDebtRatioPercent(uint256 _maxDebtRatioPercent) external onlyOperator {
        require(_maxDebtRatioPercent >= 1000 && _maxDebtRatioPercent <= 10000, "out of range"); // [10%, 100%]
        maxDebtRatioPercent = _maxDebtRatioPercent;
    }

    function setBootstrap(uint256 _bootstrapEpochs, uint256 _bootstrapSupplyExpansionPercent) external onlyOperator {
        require(_bootstrapEpochs <= 120, "_bootstrapEpochs: out of range"); // <= 1 month
        require(_bootstrapSupplyExpansionPercent >= 100 && _bootstrapSupplyExpansionPercent <= 1000, "_bootstrapSupplyExpansionPercent: out of range"); // [1%, 10%]
        bootstrapEpochs = _bootstrapEpochs;
        bootstrapSupplyExpansionPercent = _bootstrapSupplyExpansionPercent;
    }

    function setExtraFunds(
        address _daoFund,
        uint256 _daoFundSharedPercent,
        address _devFund,
        uint256 _devFundSharedPercent,
        address _insuranceFund,	
        uint256 _insuranceFundSharedPercent
    ) external onlyOperator {
        require(_daoFund != address(0), "zero");
        require(_daoFundSharedPercent <= 3000, "out of range"); // <= 30%
        require(_devFund != address(0), "zero");
        require(_devFundSharedPercent <= 1000, "out of range"); // <= 10%
        require(_insuranceFund != address(0), "zero");
        require(_insuranceFundSharedPercent <= 1000, "out of range"); // <= 10%
        
        daoFund = _daoFund;
        daoFundSharedPercent = _daoFundSharedPercent;
        
        devFund = _devFund;
        devFundSharedPercent = _devFundSharedPercent;
        insuranceFund = _insuranceFund;	
        insuranceFundSharedPercent = _insuranceFundSharedPercent;
    }

    function setMaxDiscountRate(uint256 _maxDiscountRate) external onlyOperator {
        maxDiscountRate = _maxDiscountRate;
    }

    function setMaxPremiumRate(uint256 _maxPremiumRate) external onlyOperator {
        maxPremiumRate = _maxPremiumRate;
    }

    function setDiscountPercent(uint256 _discountPercent) external onlyOperator {
        require(_discountPercent <= 20000, "_discountPercent is over 200%");
        discountPercent = _discountPercent;
    }

    function setPremiumThreshold(uint256 _premiumThreshold) external onlyOperator {
        require(_premiumThreshold >= libraPriceCeiling, "_premiumThreshold exceeds libraPriceCeiling");
        require(_premiumThreshold <= 150, "_premiumThreshold is higher than 1.5");
        premiumThreshold = _premiumThreshold;
    }

    function setPremiumPercent(uint256 _premiumPercent) external onlyOperator {
        require(_premiumPercent <= 20000, "_premiumPercent is over 200%");
        premiumPercent = _premiumPercent;
    }

    function setMintingFactorForPayingDebt(uint256 _mintingFactorForPayingDebt) external onlyOperator {
        require(_mintingFactorForPayingDebt >= 10000 && _mintingFactorForPayingDebt <= 20000, "_mintingFactorForPayingDebt: out of range"); // [100%, 200%]
        mintingFactorForPayingDebt = _mintingFactorForPayingDebt;
    }

    function setBondSupplyExpansionPercent(uint256 _bondSupplyExpansionPercent) external onlyOperator {
        bondSupplyExpansionPercent = _bondSupplyExpansionPercent;
    }

    /* ========== MUTABLE FUNCTIONS ========== */

    function _updateLibraPrice() internal {
        try IOracle(libraOracle).update() {} catch {}
    }

    function getLibraCirculatingSupply() public view returns (uint256) {
        IERC20 libraErc20 = IERC20(libra);
        uint256 totalSupply = libraErc20.totalSupply();
        uint256 balanceExcluded = 0;
        for (uint8 entryId = 0; entryId < excludedFromTotalSupply.length; ++entryId) {
            balanceExcluded = balanceExcluded.add(libraErc20.balanceOf(excludedFromTotalSupply[entryId]));
        }
        return totalSupply.sub(balanceExcluded);
    }

    function buyBonds(uint256 _libraAmount, uint256 targetPrice) external onlyOneBlock checkCondition checkOperator {
        require(_libraAmount > 0, "Treasury: cannot purchase bonds with zero amount");

        uint256 libraPrice = getLibraPrice();
        require(libraPrice == targetPrice, "Treasury: LIBRA price moved");
        require(
            libraPrice < libraPriceOne, // price < $1
            "Treasury: libraPrice not eligible for bond purchase"
        );

        require(_libraAmount <= epochSupplyContractionLeft, "Treasury: not enough bond left to purchase");

        uint256 _rate = getBondDiscountRate();
        require(_rate > 0, "Treasury: invalid bond rate");

        uint256 _bondAmount = _libraAmount.mul(_rate).div(1e18);
        uint256 libraSupply = getLibraCirculatingSupply();
        uint256 newBondSupply = IERC20(lbond).totalSupply().add(_bondAmount);
        require(newBondSupply <= libraSupply.mul(maxDebtRatioPercent).div(10000), "over max debt ratio");

        IBasisAsset(libra).burnFrom(msg.sender, _libraAmount);
        IBasisAsset(lbond).mint(msg.sender, _bondAmount);

        epochSupplyContractionLeft = epochSupplyContractionLeft.sub(_libraAmount);
        _updateLibraPrice();

        emit BoughtBonds(msg.sender, _libraAmount, _bondAmount);
    }

    function redeemBonds(uint256 _bondAmount, uint256 targetPrice) external onlyOneBlock checkCondition checkOperator {
        require(_bondAmount > 0, "Treasury: cannot redeem bonds with zero amount");

        uint256 libraPrice = getLibraPrice();
        require(libraPrice == targetPrice, "Treasury: LIBRA price moved");
        require(
            libraPrice > libraPriceCeiling, // price > $1.01
            "Treasury: libraPrice not eligible for bond purchase"
        );

        uint256 _rate = getBondPremiumRate();
        require(_rate > 0, "Treasury: invalid bond rate");

        uint256 _libraAmount = _bondAmount.mul(_rate).div(1e18);
        require(IERC20(libra).balanceOf(address(this)) >= _libraAmount, "Treasury: treasury has no more budget");

        seigniorageSaved = seigniorageSaved.sub(Math.min(seigniorageSaved, _libraAmount));

        IBasisAsset(lbond).burnFrom(msg.sender, _bondAmount);
        IERC20(libra).safeTransfer(msg.sender, _libraAmount);

        _updateLibraPrice();

        emit RedeemedBonds(msg.sender, _libraAmount, _bondAmount);
    }

    function _sendToBoardroom(uint256 _amount) internal {
        IBasisAsset(libra).mint(address(this), _amount);

        uint256 _daoFundSharedAmount = 0;
        if (daoFundSharedPercent > 0) {
            _daoFundSharedAmount = _amount.mul(daoFundSharedPercent).div(10000);
            IERC20(libra).transfer(daoFund, _daoFundSharedAmount);
            emit DaoFundFunded(now, _daoFundSharedAmount);
        }

        uint256 _devFundSharedAmount = 0;
        if (devFundSharedPercent > 0) {
            _devFundSharedAmount = _amount.mul(devFundSharedPercent).div(10000);
            IERC20(libra).transfer(devFund, _devFundSharedAmount);
            emit DevFundFunded(now, _devFundSharedAmount);
        }

        _amount = _amount.sub(_daoFundSharedAmount).sub(_devFundSharedAmount);

        IERC20(libra).safeApprove(boardroom, 0);
        IERC20(libra).safeApprove(boardroom, _amount);
        IBoardroom(boardroom).allocateSeigniorage(_amount);
        emit BoardroomFunded(now, _amount);
    }

    function _sendToBondTreasury(uint256 _amount) internal {
        uint256 treasuryBalance = IERC20(libra).balanceOf(bondTreasury);
        uint256 treasuryVested = IBondTreasury(bondTreasury).totalVested();
        if (treasuryVested >= treasuryBalance) return;
        uint256 unspent = treasuryBalance.sub(treasuryVested);
        if (_amount > unspent) {
            IBasisAsset(libra).mint(bondTreasury, _amount.sub(unspent));
        }
    }

    function _calculateMaxSupplyExpansionPercent(uint256 _libraSupply) internal returns (uint256) {
        for (uint8 tierId = 8; tierId >= 0; --tierId) {
            if (_libraSupply >= supplyTiers[tierId]) {
                maxSupplyExpansionPercent = maxExpansionTiers[tierId];
                break;
            }
        }
        return maxSupplyExpansionPercent;
    }

    function allocateSeigniorage() external onlyOneBlock checkCondition checkEpoch checkOperator {
        _updateLibraPrice();
        previousEpochLibraPrice = getLibraPrice();
        uint256 libraSupply = getLibraCirculatingSupply().sub(seigniorageSaved);
        _sendToBondTreasury(libraSupply.mul(bondSupplyExpansionPercent).div(10000));
        if (epoch < bootstrapEpochs) {
            // 28 first epochs with 4.5% expansion
            _sendToBoardroom(libraSupply.mul(bootstrapSupplyExpansionPercent).div(10000));
        } else {
            if (previousEpochLibraPrice > libraPriceCeiling) {
                // Expansion ($LIBRA Price > 1 $ASTR): there is some seigniorage to be allocated
                uint256 bondSupply = IERC20(lbond).totalSupply();
                uint256 _percentage = previousEpochLibraPrice.sub(libraPriceOne);
                uint256 _savedForBond;
                uint256 _savedForBoardroom;
                uint256 _mse = _calculateMaxSupplyExpansionPercent(libraSupply).mul(1e14);
                if (_percentage > _mse) {
                    _percentage = _mse;
                }
                if (seigniorageSaved >= bondSupply.mul(bondDepletionFloorPercent).div(10000)) {
                    // saved enough to pay debt, mint as usual rate
                    _savedForBoardroom = libraSupply.mul(_percentage).div(1e18);
                } else {
                    // have not saved enough to pay debt, mint more
                    uint256 _seigniorage = libraSupply.mul(_percentage).div(1e18);
                    _savedForBoardroom = _seigniorage.mul(seigniorageExpansionFloorPercent).div(10000);
                    _savedForBond = _seigniorage.sub(_savedForBoardroom);
                    if (mintingFactorForPayingDebt > 0) {
                        _savedForBond = _savedForBond.mul(mintingFactorForPayingDebt).div(10000);
                    }
                }
                if (_savedForBoardroom > 0) {
                    _sendToBoardroom(_savedForBoardroom);
                }
                if (_savedForBond > 0) {
                    seigniorageSaved = seigniorageSaved.add(_savedForBond);
                    IBasisAsset(libra).mint(address(this), _savedForBond);
                    emit TreasuryFunded(now, _savedForBond);
                }
            }
        }
    }

    function governanceRecoverUnsupported(
        IERC20 _token,
        uint256 _amount,
        address _to
    ) external onlyOperator {
        // do not allow to drain core tokens
        require(address(_token) != address(libra), "libra");
        require(address(_token) != address(lbond), "bond");
        require(address(_token) != address(lshare), "share");
        _token.safeTransfer(_to, _amount);
    }

    function boardroomSetOperator(address _operator) external onlyOperator {
        IBoardroom(boardroom).setOperator(_operator);
    }

    function boardroomSetLockUp(uint256 _withdrawLockupEpochs, uint256 _rewardLockupEpochs) external onlyOperator {
        IBoardroom(boardroom).setLockUp(_withdrawLockupEpochs, _rewardLockupEpochs);
    }

    function boardroomAllocateSeigniorage(uint256 amount) external onlyOperator {
        IBoardroom(boardroom).allocateSeigniorage(amount);
    }

    function boardroomGovernanceRecoverUnsupported(
        address _token,
        uint256 _amount,
        address _to
    ) external onlyOperator {
        IBoardroom(boardroom).governanceRecoverUnsupported(_token, _amount, _to);
    }
}
