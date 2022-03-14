// SPDX-License-Identifier: MIT

pragma solidity 0.6.12;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/access/Ownable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

/*
  ______                __       _______
 /_  __/___  ____ ___  / /_     / ____(_)___  ____ _____  ________
  / / / __ \/ __ `__ \/ __ \   / /_  / / __ \/ __ `/ __ \/ ___/ _ \
 / / / /_/ / / / / / / /_/ /  / __/ / / / / / /_/ / / / / /__/  __/
/_/  \____/_/ /_/ /_/_.___/  /_/   /_/_/ /_/\__,_/_/ /_/\___/\___/

    http://tomb.finance
*/
contract TombTaxOracle is Ownable {
    using SafeMath for uint256;

    IERC20 public tomb;
    // IERC20 public wftm;
    IERC20 public wastr;
    address public pair;

    constructor(
        address _tomb,
        // address _wftm,
        address _wastr;
        address _pair
    ) public {
        require(_tomb != address(0), "tomb address cannot be 0");
        // require(_wftm != address(0), "wftm address cannot be 0");
        require(_wastr != address(0), "wastr address cannot be 0");
        require(_pair != address(0), "pair address cannot be 0");
        tomb = IERC20(_tomb);
        wastr = IERC20(_wastr);
        pair = _pair;
    }

    function consult(address _token, uint256 _amountIn) external view returns (uint144 amountOut) {
        require(_token == address(tomb), "token needs to be tomb");
        uint256 tombBalance = tomb.balanceOf(pair);
        // uint256 wftmBalance = wftm.balanceOf(pair);
        uint256 wastrBalance = wastr.balanceOf(pair);
        // return uint144(tombBalance.div(wftmBalance));
        return uint144(tombBalance.div(wastrBalance));
    }

    function setTomb(address _tomb) external onlyOwner {
        require(_tomb != address(0), "tomb address cannot be 0");
        tomb = IERC20(_tomb);
    }

    // function setWftm(address _wftm) external onlyOwner {
    //     require(_wftm != address(0), "wftm address cannot be 0");
    //     wftm = IERC20(_wftm);
    // }
    function setWastr(address _wastr) external onlyOwner {
        require(_wastr != address(0), "wastr address cannot be 0");
        wastr = IERC20(_wastr);
    }

    function setPair(address _pair) external onlyOwner {
        require(_pair != address(0), "pair address cannot be 0");
        pair = _pair;
    }



}
