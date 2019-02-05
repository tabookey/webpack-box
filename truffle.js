// Allows us to use ES6 in our migrations and tests.
// require('babel-register')
var mnemonic = "digital unknown jealous mother legal hedgehog save glory december universe spread figure custom found six"

module.exports = {
  networks: {
    development: {
      verbose: process.env.VERBOSE,
      host: '127.0.0.1',
      port: 8545,
	    gas: 5000000,
      network_id: '*' // Match any network id
    },
    ropsten: {
      provider: function() {
        var HDWalletProvider = require("truffle-hdwallet-provider");
        return new HDWalletProvider(mnemonic, "https://ropsten.infura.io/v3/c3422181d0594697a38defe7706a1e5b")
      },
      network_id: 3
    },
    xdai: {
		
      provider: function() {
	var fs = require('fs')
	const secret_mnemonic_file = __dirname + "/secret_mnemonic"

	var HDWalletProvider = require("truffle-hdwallet-provider");
  	secret_mnemonic = fs.readFileSync(secret_mnemonic_file , {encoding:'utf8'})
        let wallet = new HDWalletProvider(secret_mnemonic, "https://dai.poa.network")

        return wallet
		sendFunc = function( r,cb) {
			console.log( "req=",JSON.stringify(r))
			wallet.send(r,(e,r)=>{
				console.log( "resp=", JSON.stringify(e||r) )
				cb(e,r)
			})
		}
	return {
		send : sendFunc,
		sendAsync : sendFunc
	}
      },
      network_id: 100
    }
  }
}
