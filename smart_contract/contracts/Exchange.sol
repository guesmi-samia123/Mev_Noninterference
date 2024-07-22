// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";

contract Exhchange {

    address public owner;
    uint public rate;
    address public tin;
    ERC20 public tout;

    event TransferEther(
      address indexed sender,
      address indexed recipient,
      uint amount
    );
     event Transfer(address indexed from, address indexed to, uint256 value);


    constructor(ERC20 _tout, uint _rate) payable {
        require(_rate > 0, "Rate must be greater than zero");
        rate = _rate;
        tin = address(0);
        tout = _tout;
        owner = msg.sender;
    }
     function getTokens() external view returns (address, address) {
        return (tin, address(tout));
    }

    function getRate() external view returns (uint) {
        return rate;
    }

    function setRate(uint newRate) external {
        require(msg.sender == owner, "Only owner can set rate");
        rate = newRate;
    }
    function swap (uint256 _amount, address _address) external payable {
        require (_address == tin, "Sender must hold token tin");
        require (tout.balanceOf(address(this))>= _amount * rate);
        payable(msg.sender).transfer(_amount);
         emit TransferEther(msg.sender, address(this), _amount);
         tout.transferFrom(address(this), msg.sender,  _amount * rate);
         emit Transfer(address(this),msg.sender ,  _amount * rate);
    }

}