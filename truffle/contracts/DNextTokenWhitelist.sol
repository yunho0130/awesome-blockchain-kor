pragma solidity ^0.4.21;

/**
 * The DNextTokenWhitelist contract does this and that...
 */
contract DNextTokenWhitelist {
	address owner;
	function DNextTokenWhitelist () public {
		owner = msg.sender;
	}
	
}

mapping (bytes32 => bool) whitelist;

function register () external {
	whitelist[keccak256(msg.sender)] = true;
}

function unregister () external {
	whitelist[keccak256(msg.sender)] = false;
}

function isRegistered (address anAddress) public view returns(bool registered) {
	return whitelist[keccak256(anAddress)];
}


