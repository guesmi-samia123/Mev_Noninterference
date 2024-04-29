// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./AMM.sol";

contract Bet {
    address public owner;
    address public player;
    uint public deadline;
    uint public rate;
    address public oracle;
    address public tok;

    constructor(address _oracle, address _tok, uint _rate, uint _deadline) payable {
        require(msg.value !=0 ether, "you should start the bet by an amount of ether ");
        require(_oracle != address(0), "Oracle address cannot be zero");
        (address ethToken, address _tokAddress) = AMM(_oracle).getTokens();
        require(ethToken == address(0) && _tokAddress == _tok, "Invalid token pair provided by the oracle");
        tok = _tok;
        rate = _rate;
        owner = msg.sender;
        deadline = _deadline;
        oracle = _oracle;
    }

    function bet(uint _amount) external payable {
        require(player == address(0), "Player already set");
        require(msg.value == _amount, "Incorrect amount of ether sent");
        player = msg.sender;
    }
   
    function win() external {
        require(block.number <= deadline && msg.sender == player, "Invalid caller or deadline passed");
        require(AMM(oracle).getRate(address(0)) > rate, "Current ETH rate is not higher than expected rate");
        payable(player).transfer(address(this).balance);
    }
    function close() external {
        require(block.number > deadline && msg.sender == owner, "Invalid caller or deadline passed");
        payable(owner).transfer(address(this).balance);
    }


    }