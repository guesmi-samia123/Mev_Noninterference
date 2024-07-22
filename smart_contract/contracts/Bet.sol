//SPDX-License-Identifier: UNLICENSED
pragma solidity >=0.8.0;
//pragma experimental SMTChecker;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "./AMM.sol";

contract Bet {
    address public owner;
    address public player;
    uint public deadline;
    uint public rate;
    address public oracle;
    address public tok;
    uint256 public initialpot;

    constructor(address _oracle, address  _tok, uint256 _rate, uint256 _deadline) payable {
        require(msg.value !=0 ether, "you should start the bet by an amount of ether ");
        require(_oracle != address(0), "Oracle address cannot be NULL");
        require(_tok != address(0), "token address cannot be NULL");
        tok = _tok;
        rate = _rate;
        owner = msg.sender;
        deadline = _deadline;
        oracle = _oracle;
        initialpot=getEtherBalance(address(this));
    }

    function getCurrentTimestamp() public view returns (uint256) {
        return block.timestamp;
    }

    function bet() external payable {
       require(player == address(0), "Player already set");
       require(msg.value == initialpot, "Insuficientcect amount of ether sent");
       player = msg.sender;
    }

    function getEtherBalance(address _address) public view returns (uint256){
        return _address.balance;
    }
    function callGetTokens() public view returns (string memory _ether, string memory _symbol) {
        return (AMM(oracle).getTokens());
    }
    function win() external {
        require(getCurrentTimestamp() <= deadline, "Invalid caller");
        require (msg.sender == player, "Invalid caller");
        uint256 rateAMM= (AMM(oracle).getRate("ether"));
        require (rateAMM>rate, "AMM rate must be beger that BET rate");
        (bool success, ) = payable(msg.sender).call{value: getEtherBalance(address(this))}("");
        require(success, "Failed to send Ether");}
 
    function close() external {
       require(getCurrentTimestamp() <= deadline, "Invalid caller");
       require (msg.sender == owner, "Invalid caller");
       (bool success, ) = payable(msg.sender).call{value: getEtherBalance(address(this))}("");
        require(success, "Failed to send Ether");}
 
    }