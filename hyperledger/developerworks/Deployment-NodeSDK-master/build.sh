#!/bin/bash
export FABRIC_CFG_PATH=$PWD
sh ./clean.sh
sh ./generate-certs.sh
sh ./docker-images.sh
