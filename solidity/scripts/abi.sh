#!/usr/bin/env bash

if [ -d abis ]; then
  rm -rf abis
fi

mkdir abis

./node_modules/node-jq/bin/jq '.abi' build/contracts/Staking.json > abis/Staking.abi.json
