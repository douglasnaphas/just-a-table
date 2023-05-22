#!/usr/bin/env bash
ACTUAL1=$(npx . --repo-owner douglasnaphas --repo-name just-a-table --prefix 'GitHubDeployer-' --hash-length 6)
EXPECTED1=GitHubDeployer-73ac48
if [[ "${ACTUAL1}" != "${EXPECTED1}" ]]
then
  echo "wrong role name, expected ${EXPECTED1}, got ${ACTUAL1}"
  exit 2
fi