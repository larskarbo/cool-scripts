#!/bin/bash

if [[ -f "pnpm-lock.yaml" ]]; then
  echo "pnpm-lock.yaml found. Using pnpx..."
  pnpx "$@"
elif [[ -f "yarn.lock" ]]; then
  echo "yarn.lock found. Using Yarn..."
	yarn dlx "$@"
elif [[ -f "package-lock.json" ]]; then
  echo "package-lock.json found. Using npm..."
  npx "$@"
elif [[ -f "bun.lockb" ]]; then
  echo "bun.lockb found. Using bun..."
	bunx "$@"
elif [[ -f "bun.lock" ]]; then
  echo "bun.lock found. Using bun..."
	bunx "$@"
else
  echo "No lock file found. Using npm..."
	npx "$@"
fi
