const MaengDevTokenCrowdsale = artifacts.require('./MaengDevTokenCrowdsale.sol');
const MaengDevToken = artifacts.require('./MaengDevToken.sol');

module.exports = function(deployer, network, accounts) {
	    const openingTime = web3.eth.getBlock('latest').timestamp + 2; // two secs in the future
	    const closingTime = openingTime + 86400 * 36500; // 100 years
	    const rate = new web3.BigNumber(1000);
	    const wallet = accounts[1];

	    return deployer
	        .then(() => {
			            return deployer.deploy(MaengDevToken);
			        })
	        .then(() => {
			            return deployer.deploy(
					                    MaengDevTokenCrowdsale,
					                    openingTime,
					                    closingTime,
					                    rate,
					                    wallet,
					                    MaengDevToken.address
					                );
			        });
};

