pragma solidity 0.4.24;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';

contract MaengDevToken is MintableToken {
    string public name = "MaengDev Token";
    string public symbol = "MDT";
    uint8 public decimals = 18;
}
