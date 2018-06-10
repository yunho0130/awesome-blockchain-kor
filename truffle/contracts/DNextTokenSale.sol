pragma solidity ^0.4.21;

import "./DNextToken.sol";
import "zepplin-solidity/contracts/math/SafeMath.sol";

/**
 * The DNextTokenSale contract does this and that...
 */
contract DNextTokenSale {
	uint public constant EMAS_PER_WEI = 1000000;
	uint public constant HARD_CAP = 500000000000000;
	DNextToken public token;
	uint public emasRaised; 
	bool private closed;

	function DNextTokenSale (DNextToken _token) public {
		
		require (_token != address(0));
		token = _token;
	}

	// fallback function 
	function () external payable {

		require (!closed);
		require (msg.value != 0);
		uint emasToTransfer = msg.value.mul(EMAS_PER_WEI);
		uint weisToRefund = 0;
		if (emasRaised + emasToTransfer > HARD_CAP){
			emasToTransfer = HARD_CAP - emasRaised;
			weisToRefund = msg.value - emasToTransfer.div(EMAS_PER_WEI);
			closed = true;
		}
		emasRaised = emasRaised.add(emasToTransfer);
		if (weisToRefund > 0){
			msg.sender.transfer(weisToRefund);
		}

		token.transfer(msg.sender, emasToTransfer);

	}
	
}
