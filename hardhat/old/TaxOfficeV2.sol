// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "./owner/Operator.sol";
import "./interfaces/ITaxable.sol";
import "./interfaces/IUniswapV2Router.sol";
import "./interfaces/IERC20.sol";

/*
  ______                __       _______
 /_  __/___  ____ ___  / /_     / ____(_)___  ____ _____  ________
  / / / __ \/ __ `__ \/ __ \   / /_  / / __ \/ __ `/ __ \/ ___/ _ \
 / / / /_/ / / / / / / /_/ /  / __/ / / / / / /_/ / / / / /__/  __/
/_/  \____/_/ /_/ /_/_.___/  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/

    http://libra.finance
*/
contract TaxOfficeV2 is Operator {
    using SafeMath for uint256;

    address public libra = address(0x6c021Ae822BEa943b2E66552bDe1D2696a53fbB7);
    address public wftm = address(0x21be370D5312f44cB42ce377BC9b8a0cEF1A4C83);
    address public uniRouter = address(0xF491e7B69E4244ad4002BC14e878a34207E38c29);

    mapping(address => bool) public taxExclusionEnabled;

    function setTaxTiersTwap(uint8 _index, uint256 _value) public onlyOperator returns (bool) {
        return ITaxable(libra).setTaxTiersTwap(_index, _value);
    }

    function setTaxTiersRate(uint8 _index, uint256 _value) public onlyOperator returns (bool) {
        return ITaxable(libra).setTaxTiersRate(_index, _value);
    }

    function enableAutoCalculateTax() public onlyOperator {
        ITaxable(libra).enableAutoCalculateTax();
    }

    function disableAutoCalculateTax() public onlyOperator {
        ITaxable(libra).disableAutoCalculateTax();
    }

    function setTaxRate(uint256 _taxRate) public onlyOperator {
        ITaxable(libra).setTaxRate(_taxRate);
    }

    function setBurnThreshold(uint256 _burnThreshold) public onlyOperator {
        ITaxable(libra).setBurnThreshold(_burnThreshold);
    }

    function setTaxCollectorAddress(address _taxCollectorAddress) public onlyOperator {
        ITaxable(libra).setTaxCollectorAddress(_taxCollectorAddress);
    }

    function excludeAddressFromTax(address _address) external onlyOperator returns (bool) {
        return _excludeAddressFromTax(_address);
    }

    function _excludeAddressFromTax(address _address) private returns (bool) {
        if (!ITaxable(libra).isAddressExcluded(_address)) {
            return ITaxable(libra).excludeAddress(_address);
        }
    }

    function includeAddressInTax(address _address) external onlyOperator returns (bool) {
        return _includeAddressInTax(_address);
    }

    function _includeAddressInTax(address _address) private returns (bool) {
        if (ITaxable(libra).isAddressExcluded(_address)) {
            return ITaxable(libra).includeAddress(_address);
        }
    }

    function taxRate() external view returns (uint256) {
        return ITaxable(libra).taxRate();
    }

    function addLiquidityTaxFree(
        address token,
        uint256 amtTomb,
        uint256 amtToken,
        uint256 amtTombMin,
        uint256 amtTokenMin
    )
        external
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        require(amtTomb != 0 && amtToken != 0, "amounts can't be 0");
        _excludeAddressFromTax(msg.sender);

        IERC20(libra).transferFrom(msg.sender, address(this), amtTomb);
        IERC20(token).transferFrom(msg.sender, address(this), amtToken);
        _approveTokenIfNeeded(libra, uniRouter);
        _approveTokenIfNeeded(token, uniRouter);

        _includeAddressInTax(msg.sender);

        uint256 resultAmtTomb;
        uint256 resultAmtToken;
        uint256 liquidity;
        (resultAmtTomb, resultAmtToken, liquidity) = IUniswapV2Router(uniRouter).addLiquidity(
            libra,
            token,
            amtTomb,
            amtToken,
            amtTombMin,
            amtTokenMin,
            msg.sender,
            block.timestamp
        );

        if(amtTomb.sub(resultAmtTomb) > 0) {
            IERC20(libra).transfer(msg.sender, amtTomb.sub(resultAmtTomb));
        }
        if(amtToken.sub(resultAmtToken) > 0) {
            IERC20(token).transfer(msg.sender, amtToken.sub(resultAmtToken));
        }
        return (resultAmtTomb, resultAmtToken, liquidity);
    }

    function addLiquidityETHTaxFree(
        uint256 amtTomb,
        uint256 amtTombMin,
        uint256 amtFtmMin
    )
        external
        payable
        returns (
            uint256,
            uint256,
            uint256
        )
    {
        require(amtTomb != 0 && msg.value != 0, "amounts can't be 0");
        _excludeAddressFromTax(msg.sender);

        IERC20(libra).transferFrom(msg.sender, address(this), amtTomb);
        _approveTokenIfNeeded(libra, uniRouter);

        _includeAddressInTax(msg.sender);

        uint256 resultAmtTomb;
        uint256 resultAmtFtm;
        uint256 liquidity;
        (resultAmtTomb, resultAmtFtm, liquidity) = IUniswapV2Router(uniRouter).addLiquidityETH{value: msg.value}(
            libra,
            amtTomb,
            amtTombMin,
            amtFtmMin,
            msg.sender,
            block.timestamp
        );

        if(amtTomb.sub(resultAmtTomb) > 0) {
            IERC20(libra).transfer(msg.sender, amtTomb.sub(resultAmtTomb));
        }
        return (resultAmtTomb, resultAmtFtm, liquidity);
    }

    function setTaxableTombOracle(address _libraOracle) external onlyOperator {
        ITaxable(libra).setTombOracle(_libraOracle);
    }

    function transferTaxOffice(address _newTaxOffice) external onlyOperator {
        ITaxable(libra).setTaxOffice(_newTaxOffice);
    }

    function taxFreeTransferFrom(
        address _sender,
        address _recipient,
        uint256 _amt
    ) external {
        require(taxExclusionEnabled[msg.sender], "Address not approved for tax free transfers");
        _excludeAddressFromTax(_sender);
        IERC20(libra).transferFrom(_sender, _recipient, _amt);
        _includeAddressInTax(_sender);
    }

    function setTaxExclusionForAddress(address _address, bool _excluded) external onlyOperator {
        taxExclusionEnabled[_address] = _excluded;
    }

    function _approveTokenIfNeeded(address _token, address _router) private {
        if (IERC20(_token).allowance(address(this), _router) == 0) {
            IERC20(_token).approve(_router, type(uint256).max);
        }
    }
}
