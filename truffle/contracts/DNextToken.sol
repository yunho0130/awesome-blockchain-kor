pragma solidity ^0.4.21;
import 'zepplin-solidity/contracts/token/ERC20/StandardToken.sol';
contract DNextToken is StandardToken {
	unit public INITIAL_SUPPLY = 21000000;
	string public name = 'DNextToken';
	string public symbol = 'DNX'
	uint8 public decimals = 8;
	address owner;

	totalSupply_ = INITIAL_SUPPLY * 10 ** unit(decimals);
	balances[msg.sender] = INITIAL_SUPPLY; 
	owner = msg.sender;
}

bool public released = false;  // Change this value as 'true' for public token sale
function released () public {
	require (owner == msg.sender);
	released = true;
}

modifier onlyReleased() { 
	require (released); 
	_; 
}

function transfer (address to, unit256 value) onlyReleased public returns(bool) {
	super.transfer(to, value);
}
function allowance (address owner, address spender) onlyReleased public view returns(unit256) {
	super.allowance(owner, spender);
}
function transferForm (address from, address to, unit256 value) onlyReleased public returns(bool) {
	super.transferForm(from, to, value);
}
function approve (address spender, unit256 value) onlyReleased public returns(bool) {
	super.approve(spender, value);
}




