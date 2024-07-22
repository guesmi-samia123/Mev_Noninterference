// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

contract USDC is ERC20 {
    address public  owner ;
    constructor() ERC20("USD Coin", "USDC") {
        _mint(msg.sender, 1000 * (10 ** uint256(decimals())));
        owner = msg.sender;
        }
    // Override the decimals function to return 6
    function decimals() public view virtual override returns (uint8) {
        return 6;
    }
   }