#!/bin/bash

# Exit on first error, print all commands.
set -ev

# Set ARCH
ARCH=`uname -m`

# Grab the current directory.
DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )"

# Pull and tag the latest Hyperledger Fabric base image.
# update for HPL V1.1
docker pull hyperledger/fabric-peer:$ARCH-1.1.0
docker pull hyperledger/fabric-ca:$ARCH-1.1.0
docker pull hyperledger/fabric-ccenv:$ARCH-1.1.0
docker pull hyperledger/fabric-orderer:$ARCH-1.1.0
docker pull ishangulhane/fabric-couchdb   #CouchDB has not been upgraded to V1.1.0
