// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
import "./DappToken.sol";
contract DappTokenSale {
   address admin;
   uint256 public tokenPrice;
   uint256 public tokenSold;
   event Sell(address _buyer,uint256 _amount);
   DappToken public tokenContract;
    constructor(DappToken _tokenContract,uint256 _tokenPrice) public {
        admin = msg.sender;
        tokenContract = _tokenContract;
        tokenPrice = _tokenPrice;
    }
    function buyTokens(uint256 _numberOfTokens) public payable{
        //We should have more than requested tokens
        //require(tokenContract.balanceOf(address(this)) >= _numberOfTokens);
        //Just Like that
        require(msg.value == _numberOfTokens * tokenPrice);
        //transfer function called to send the tokens to the requesting address
        require(tokenContract.transfer(msg.sender,_numberOfTokens));
        //To keep track of the number of tokens sold
         tokenSold += _numberOfTokens;
         emit Sell(msg.sender,_numberOfTokens);
    }
    //endSale will destroy the smart contract and give awy all the money to the owner(admin)
    function endSale() public {
        require(msg.sender == admin);
        require(tokenContract.transfer(admin,tokenContract.balanceOf(address(this))));
        //removes the storage and states of the smart contract
        selfdestruct(msg.sender);
    }
}