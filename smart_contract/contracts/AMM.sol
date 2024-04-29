// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.0;
import "@openzeppelin/contracts/token/ERC20/ERC20.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
contract AMM {
    ERC20  private _Token;

    event TransferEther(
      address indexed sender,
      address indexed recipient,
      uint amount
    );
     event Transfer(address indexed from, address indexed to, uint256 value);

     constructor (ERC20 token) {
    require(address(token) != address(0), "Address is empty!");
    _Token = token;
}
      // Modifier to check token allowance
    modifier checkAllowance(uint amount) {
        require(_Token.allowance(msg.sender, address(this)) >= amount, "Error");
        _;
    }
     function depositTokens(address _to, uint256 _amount) public checkAllowance(_amount) {
        require (_Token.balanceOf(address(this))>=_amount, "Insufficient balance");
       _Token.transfer(_to, _amount);
    }

     function transferEther(address payable recipient, uint256 amount) public payable {
        require(amount <= address(this).balance, "Insufficient balance");
        recipient.transfer(amount);
    }
    function get_TokenAddress() public view returns(address){
        return address(_Token);
    }

     function addLiquidity (uint256 _amount) external payable {
        require(msg.value != 0 && _amount != 0, "Values to add are empty");
        //require(address(this).balance * _amount == _Token.balanceOf(address(this)) * msg.value, "Invalid liquidity provided");
        require (address(this).balance>=msg.value, "Insufficient balance");
        depositTokens(address(this), _amount);
        emit Transfer(msg.sender, address(this), _amount);
        payable(address(this)).transfer(msg.value);
        emit TransferEther(msg.sender, address(this), msg.value);
    }
   
    function getBalanceOfERC20(address account) external view returns (uint256) {
        return _Token.balanceOf(account);
    }
  function getTokens() public view returns (address etherAddress, address tokenAddress) {
    etherAddress = address(0); 
    tokenAddress = address(_Token);
}
function getRate(address token) public view returns (uint256) {
    if (token == address(0)) {
        return _Token.balanceOf(address(this)) / address(this).balance;
    }
    else if (token == address(_Token)) {
        return address(this).balance / _Token.balanceOf(address(this));
    }
    return 0;
}
function swap (uint256 _amount, address token) public payable {
    uint256 y;
    uint256 K = address(this).balance * _Token.balanceOf(address(this));

    if (token == address(0))
    {
        y=_amount* getRate(address(_Token));
        require(_Token.balanceOf(address(this)) >=y, "Insufficient balance");
        payable(address(this)).transfer(_amount);
        emit TransferEther(msg.sender, address(this), _amount);
        depositTokens(msg.sender, y);
        emit Transfer(address(this),msg.sender,  y);

    } else  if (token == address(_Token))
    {
         y=_amount* getRate(address(0));
         require(address(this).balance >=y, "Insufficient balance");
          _Token.transferFrom(msg.sender,address(this) , _amount);
         emit Transfer(msg.sender,address(this) , _amount);
         payable(msg.sender).transfer(y);
         emit TransferEther(address(this),msg.sender, y);
    }
}

}