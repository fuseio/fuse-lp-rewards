#!/usr/bin/env bash

if [ -d flats ]; then
  rm -rf flats
fi

mkdir flats

./node_modules/.bin/truffle-flattener contracts/Staking.sol > flats/Staking_flat.sol
