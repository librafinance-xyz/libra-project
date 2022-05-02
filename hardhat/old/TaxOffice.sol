// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "./owner/Operator.sol";
import "./interfaces/ITaxable.sol";

/*
  ______                __       _______
 /_  __/___  ____ ___  / /_     / ____(_)___  ____ _____  ________
  / / / __ \/ __ `__ \/ __ \   / /_  / / __ \/ __ `/ __ \/ ___/ _ \
 / / / /_/ / / / / / / /_/ /  / __/ / / / / / /_/ / / / / /__/  __/
/_/  \____/_/ /_/ /_/_.___/  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/

    http://libra.finance
*/
contract TaxOffice is Operator {
    address public libra;

    constructor(address _libra) public {
        require(_libra != address(0), "libra address cannot be 0");
        libra = _libra;
    }

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
        return ITaxable(libra).excludeAddress(_address);
    }

    function includeAddressInTax(address _address) external onlyOperator returns (bool) {
        return ITaxable(libra).includeAddress(_address);
    }

    function setTaxableLibraOracle(address _libraOracle) external onlyOperator {
        ITaxable(libra).setLibraOracle(_libraOracle);
    }

    function transferTaxOffice(address _newTaxOffice) external onlyOperator {
        ITaxable(libra).setTaxOffice(_newTaxOffice);
    }
}
