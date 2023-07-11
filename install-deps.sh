#!/bin/bash

if [[ -f "package-lock.json" ]]; then
  echo "package-lock.json found. Using npm..."
  npm i "$@"
elif [[ -f "yarn.lock" ]]; then
  echo "yarn.lock found. Using Yarn..."
  yarn i "$@"
elif [[ -f "pnpm-lock.yaml" ]]; then
  echo "pnpm-lock.yaml found. Using pnpm..."
  pnpm i "$@"
else
  echo "No lock file found. Exiting..."
fi
