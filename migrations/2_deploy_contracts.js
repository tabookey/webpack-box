var config = require( '../truffle.js')
var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var RelayHub = artifacts.require('RelayHub')


module.exports = function (deployer, network) {

    //TODO: find a better way to tell which network we're using...
    var cmdline = process.argv.join(" ")
    var net
    var hubaddr
    if ( cmdline.indexOf('ropsten') > 0 ) {
        hubaddr='0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87' // ropsten 0.3.1
        net='ropsten'
    }
    else {
        hubaddr="0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B" //local
        net='private'
    }

    console.log( 'Using network ', net, 'hub-addr=',hubaddr )

    deployer.deploy(ConvertLib);
    deployer.link(ConvertLib, MetaCoin);
    let dep = deployer.deploy(MetaCoin, hubaddr)

    if ( network!= 'development' ) {
 	dep.then(()=>{
 	  console.log( "=== Make sure to use http://gsn.tabookey.com/webtools/contractmanager.html" )
	  console.log( "===  to make a deposit for ",MetaCoin.address, "on network", network )
	})
    } else {
	dep.then(()=>RelayHub.at(hubaddr))
	.then(hub=>hub.depositFor(MetaCoin.address, {value: 1e17} ))
	.then(()=>console.log( "deposited." ) )
	.catch(e=>console.log( "wtf?",e) )
    }
}
