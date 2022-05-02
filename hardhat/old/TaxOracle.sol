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

    http://libra.finance
*/
contract LibraTaxOracle is Ownable {
    using SafeMath for uint256;

    IERC20 public libra;
    // IERC20 public wastr;
    IERC20 public wastr;
    address public pair;

    constructor(
        address _libra,
        // address _wastr,
        address _wastr;
        address _pair
    ) public {
        require(_libra != address(0), "libra address cannot be 0");
        // require(_wastr != address(0), "wastr address cannot be 0");
        require(_wastr != address(0), "wastr address cannot be 0");
        require(_pair != address(0), "pair address cannot be 0");
        libra = IERC20(_libra);
        wastr = IERC20(_wastr);
        pair = _pair;
    }

    function consult(address _token, uint256 _amountIn) external view returns (uint144 amountOut) {
        require(_token == address(libra), "token needs to be libra");
        uint256 libraBalance = libra.balanceOf(pair);
        // uint256 wastrBalance = wastr.balanceOf(pair);
        uint256 wastrBalance = wastr.balanceOf(pair);
        // return uint144(libraBalance.div(wastrBalance));
        return uint144(libraBalance.div(wastrBalance));
    }

    function setLibra(address _libra) external onlyOwner {
        require(_libra != address(0), "libra address cannot be 0");
        libra = IERC20(_libra);
    }

    // function setWftm(address _wastr) external onlyOwner {
    //     require(_wastr != address(0), "wastr address cannot be 0");
    //     wastr = IERC20(_wastr);
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
