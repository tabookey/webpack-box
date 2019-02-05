var config = require( '../truffle.js')
var ConvertLib = artifacts.require('./ConvertLib.sol')
var MetaCoin = artifacts.require('./MetaCoin.sol')
var RelayHub = artifacts.require('RelayHub')


module.exports = function (deployer, network) {

    hubs={
        "development": "0x254dffcd3277C0b1660F6d42EFbB754edaBAbC2B",
        "ropsten" : "0x1349584869A1C7b8dc8AE0e93D8c15F5BB3B4B87",
        "xdai" : "0x49a984490a7762B0e5d775f0FfA608899Ebe2ee8"
    }

    hubaddr = hubs[network]

    if ( !hubaddr) {
        console.log( "FATAL: unable to find RelayHub for network", network)
        process.exit(1)
    }
    console.log( 'Using network ', network, 'hub-addr=',hubaddr )

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
