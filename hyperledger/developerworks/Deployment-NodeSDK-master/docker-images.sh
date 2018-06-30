#!/bin/bash
set -eu

dockerFabricPull() {
  local FABRIC_TAG=$1
  #for IMAGES in peer orderer ccenv couchdb; do
    for IMAGES in peer orderer ccenv; do
      echo "==> FABRIC IMAGE: $IMAGES"
      echo
      docker pull hyperledger/fabric-$IMAGES:$FABRIC_TAG
      docker tag hyperledger/fabric-$IMAGES:$FABRIC_TAG hyperledger/fabric-$IMAGES
  done
}

dockerCaPull() {
      local CA_TAG=$1
      echo "==> FABRIC CA IMAGE"
      echo
      docker pull hyperledger/fabric-ca:$CA_TAG
      docker tag hyperledger/fabric-ca:$CA_TAG hyperledger/fabric-ca
}

dockerCouchDBPull() {
      echo "==> Couchdb IMAGE"
      echo
      docker pull ishangulhane/fabric-couchdb
      docker tag ishangulhane/fabric-couchdb ishangulhane/fabric-couchdb
}

BUILD=
DOWNLOAD=
if [ $# -eq 0 ]; then
    BUILD=true
    PUSH=true
    DOWNLOAD=true
else
    for arg in "$@"
        do
            if [ $arg == "build" ]; then
                BUILD=true
            fi
            if [ $arg == "download" ]; then
                DOWNLOAD=true
            fi
    done
fi
# 1.1.0
if [ $DOWNLOAD ]; then
    : ${CA_TAG:="x86_64-1.1.0"}
    : ${FABRIC_TAG:="x86_64-1.1.0"}


    echo "===> Pulling fabric Images"
    dockerFabricPull ${FABRIC_TAG}

    echo "===> Pulling fabric ca Image"
    dockerCaPull ${CA_TAG}

    echo "===> Pulling fabric couchdb Image"
    dockerCouchDBPull

    echo
    echo "===> List out hyperledger docker images"
    docker images | grep hyperledger*
fi

if [ $BUILD ];
    then
    echo '############################################################'
    echo '#                 BUILDING CONTAINER IMAGES                #'
    echo '############################################################'
    docker build -t orderer-peer:latest orderer/
    docker build -t shop-peer:latest shopPeer/
    docker build -t fitcoin-peer:latest fitcoinPeer/
    docker build -t shop-ca:latest shopCertificateAuthority/
    docker build -t fitcoin-ca:latest fitcoinCertificateAuthority/
    docker build -t blockchain-setup:latest blockchainNetwork/
    docker build -t blockchain-setup-couchdb:latest blockchainNetworkWithCouchDB/
fi
