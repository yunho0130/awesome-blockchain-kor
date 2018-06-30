#!/bin/sh
set -e

echo
echo "#################################################################"
echo "#######        Generating cryptographic material       ##########"
echo "#################################################################"
PROJPATH=$(pwd)
CLIPATH=$PROJPATH/cli/peers
ORDERERS=$CLIPATH/ordererOrganizations
PEERS=$CLIPATH/peerOrganizations

rm -rf $CLIPATH
$PROJPATH/cryptogen generate --config=$PROJPATH/crypto-config.yaml --output=$CLIPATH

sh generate-cfgtx.sh

rm -rf $PROJPATH/{orderer,shopPeer,fitcoinPeer}/crypto
mkdir $PROJPATH/{orderer,shopPeer,fitcoinPeer}/crypto
cp -r $ORDERERS/orderer-org/orderers/orderer0/{msp,tls} $PROJPATH/orderer/crypto
cp -r $PEERS/shop-org/peers/shop-peer/{msp,tls} $PROJPATH/shopPeer/crypto
cp -r $PEERS/fitcoin-org/peers/fitcoin-peer/{msp,tls} $PROJPATH/fitcoinPeer/crypto
cp $CLIPATH/genesis.block $PROJPATH/orderer/crypto/

SHOPCAPATH=$PROJPATH/shopCertificateAuthority
FITCOINCAPATH=$PROJPATH/fitcoinCertificateAuthority

rm -rf {$SHOPCAPATH,$FITCOINCAPATH}/{ca,tls}
mkdir -p {$SHOPCAPATH,$FITCOINCAPATH}/{ca,tls}

cp $PEERS/shop-org/ca/* $SHOPCAPATH/ca
cp $PEERS/shop-org/tlsca/* $SHOPCAPATH/tls
mv $SHOPCAPATH/ca/*_sk $SHOPCAPATH/ca/key.pem
mv $SHOPCAPATH/ca/*-cert.pem $SHOPCAPATH/ca/cert.pem
mv $SHOPCAPATH/tls/*_sk $SHOPCAPATH/tls/key.pem
mv $SHOPCAPATH/tls/*-cert.pem $SHOPCAPATH/tls/cert.pem

cp $PEERS/fitcoin-org/ca/* $FITCOINCAPATH/ca
cp $PEERS/fitcoin-org/tlsca/* $FITCOINCAPATH/tls
mv $FITCOINCAPATH/ca/*_sk $FITCOINCAPATH/ca/key.pem
mv $FITCOINCAPATH/ca/*-cert.pem $FITCOINCAPATH/ca/cert.pem
mv $FITCOINCAPATH/tls/*_sk $FITCOINCAPATH/tls/key.pem
mv $FITCOINCAPATH/tls/*-cert.pem $FITCOINCAPATH/tls/cert.pem

WEBCERTS=$PROJPATH/configuration/certs
rm -rf $WEBCERTS
mkdir -p $WEBCERTS
cp $PROJPATH/orderer/crypto/tls/ca.crt $WEBCERTS/ordererOrg.pem
cp $PROJPATH/shopPeer/crypto/tls/ca.crt $WEBCERTS/shopOrg.pem
cp $PROJPATH/fitcoinPeer/crypto/tls/ca.crt $WEBCERTS/fitcoinOrg.pem
cp $PEERS/shop-org/users/Admin@shop-org/msp/keystore/* $WEBCERTS/Admin@shop-org-key.pem
cp $PEERS/shop-org/users/Admin@shop-org/msp/signcerts/* $WEBCERTS/
cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/keystore/* $WEBCERTS/Admin@fitcoin-org-key.pem
cp $PEERS/fitcoin-org/users/Admin@fitcoin-org/msp/signcerts/* $WEBCERTS/

WEBCERTS=$PROJPATH/blockchainNetwork

BACKEND=$PROJPATH/test
rm -rf $BACKEND/set-up
mkdir -p $BACKEND/set-up
cp -r $WEBCERTS/set-up/* $BACKEND/set-up/

rm -rf $CLIPATH

cd configuration
npm install
node config.js
cd ..
