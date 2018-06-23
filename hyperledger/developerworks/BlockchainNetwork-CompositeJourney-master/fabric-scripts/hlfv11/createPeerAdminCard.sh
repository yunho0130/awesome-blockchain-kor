#!/bin/bash

# Exit on first error
set -e
# Grab the current directory
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

echo
# check that the composer command exists at a version >v0.15
if hash composer 2>/dev/null; then
    composer --version | awk -F. '{if ($2<17) exit 1}'
    if [ $? -eq 1 ]; then
        echo 'Sorry, Use createConnectionProfile for versions before v0.15.0' 
        exit 1
    else
        echo Using composer-cli at $(composer --version)
    fi
else
    echo 'Need to have composer-cli installed at v0.16 or greater'
    exit 1
fi
# need to get the certificate 

cat << EOF > /tmp/.connection.json
{
    "name": "hlfv1",
    "x-type": "hlfv1",
    "x-commitTimeout": 300,
    "version": "1.0.0",
    "client": {
        "organization": "Org1",
        "connection": {
            "timeout": {
                "peer": {
                    "endorser": "300",
                    "eventHub": "300",
                    "eventReg": "300"
                },
                "orderer": "300"
            }
        }
    },
    "orderers": {
        "orderer.example.com": { 
            "url" : "grpc://localhost:7050" 
        }
    },
    "certificateAuthorities": { 
        "ca.org1.example.com":  {
            "url": "http://localhost:7054",
            "caName": "ca.org1.example.com"
        }
    },
    "peers": {
        "peer0.org1.example.com":
        {
            "url": "grpc://localhost:7051",
            "eventUrl": "grpc://localhost:7053"
        }
    },
    "channels": {
         "composerchannel": {
         "orderers": [
                "orderer.example.com"
            ],
            "peers": {
                "peer0.org1.example.com": {}
            }
        }
    },
    "organizations": {
        "Org1": {
            "mspid": "Org1MSP",
            "peers": [
                "peer0.org1.example.com"
            ],
            "certificateAuthorities": [
                "ca.org1.example.com"
            ]
        }
    },
    "keyValStore": "${HOME}/.composer-credentials"
}
EOF

PRIVATE_KEY="${DIR}"/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/keystore/114aab0e76bf0c78308f89efc4b8c9423e31568da0c340ca187a9b17aa9a4457_sk
CERT="${DIR}"/composer/crypto-config/peerOrganizations/org1.example.com/users/Admin@org1.example.com/msp/signcerts/Admin@org1.example.com-cert.pem

if [ "${NOIMPORT}" != "true" ]; then
    CARDOUTPUT=/tmp/PeerAdmin@hlfv1.card
else
    CARDOUTPUT=PeerAdmin@hlfv1.card
fi

composer card create -p /tmp/.connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin --file $CARDOUTPUT
#composer card create -p /tmp/.connection.json -u PeerAdmin -c "${CERT}" -k "${PRIVATE_KEY}" -r PeerAdmin --file /tmp/PeerAdmin@hlfv1.card


if [ "${NOIMPORT}" != "true" ]; then
    if composer card list -c PeerAdmin@hlfv1 > /dev/null; then
        composer card delete --card PeerAdmin@hlfv1
    fi

    composer card import --file /tmp/PeerAdmin@hlfv1.card 
    composer card list
    echo "Hyperledger Composer PeerAdmin card has been imported"
    rm /tmp/PeerAdmin@hlfv1.card
else
    echo "Hyperledger Composer PeerAdmin card has been created"
fi


#if composer card list -n PeerAdmin@hlfv11 > /dev/null; then
 #   composer card delete -n PeerAdmin@hlfv11
#fi

#composer card import --file /tmp/PeerAdmin@hlfv1.card 



rm -rf /tmp/.connection.json

#echo "Hyperledger Composer PeerAdmin card has been imported"
#composer card list

