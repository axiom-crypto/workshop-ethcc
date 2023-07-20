source .env
forge script script/Distributor.s.sol:DistributorScript --private-key $PRIVATE_KEY --broadcast --rpc-url $PROVIDER_URI_GOERLI -vvvv && cp out/Distributor.sol/Distributor.json ../webapp/src/shared/abi/Distributor.json
