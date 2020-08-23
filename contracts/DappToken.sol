// SPDX-License-Identifier: MIT
pragma solidity >=0.5.0;
contract DappToken{
string public name = "Dapp Token";
string public symbol = "DAPP";
string public standard = "Dapp Token version 1.0";
mapping(address=>uint256) public balanceOf;
mapping(address=>mapping(address=>uint256)) public allowance;
uint256 public totalSupply;

event Transfer(
    address indexed _from,
    address indexed _to,
    uint256 _value
);

event Approval(
    address indexed _owner,
    address indexed _spender,
    uint256 _value
);
//Constructor
constructor(uint256 _initialSupply) public {
    balanceOf[msg.sender] = _initialSupply;
    totalSupply = _initialSupply;
    }
function transfer(address _to,uint256 _value) public returns(bool success) {
    require(balanceOf[msg.sender] >= _value,"Not enough tokens to send");
    balanceOf[msg.sender] = balanceOf[msg.sender]-_value;
    balanceOf[_to] = balanceOf[_to]+_value;
    emit Transfer(msg.sender,_to,_value);
    return true;
}

function approve(address _spender,uint256 _value) public returns(bool success) {
    allowance[msg.sender][_spender] = _value;
    emit Approval(msg.sender,_spender,_value);
    return true;
}
function transferFrom(address _from,address _to,uint256 _value) public returns(bool success){
    require(_value <= balanceOf[_from],"Sender doesn't have that much money");
    require(_value <= allowance[_from][msg.sender],"Not alloted that much money");
    balanceOf[_from] -= _value;
    balanceOf[_to] += _value;
    allowance[_from][msg.sender] -= _value;
    emit Transfer(_from,_to,_value);
    return true;
}
}