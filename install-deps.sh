#!/bin/bash

if [[ -f "pnpm-lock.yaml" ]]; then
  echo "pnpm-lock.yaml found. Using pnpm..."
  pnpm "$@"
elif [[ -f "yarn.lock" ]]; then
  echo "yarn.lock found. Using Yarn..."
  yarn "$@"
elif [[ -f "package-lock.json" ]]; then
  echo "package-lock.json found. Using npm..."
  npm "$@"
elif [[ -f "bun.lockb" ]]; then
  echo "bun.lockb found. Using bun..."
  bun "$@"
else
  echo "No lock file found. Using npm..."
	npm "$@"
fi
