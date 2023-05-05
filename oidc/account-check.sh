#!/bin/bash
CALLER_IDENTITY=$(aws sts get-caller-identity)
echo ${CALLER_IDENTITY}
ACTUAL_ACCOUNT_ID=$(echo ${CALLER_IDENTITY} | jq '.Account' | tr -d '\"')
if [[ "${ACTUAL_ACCOUNT_ID}" != "${EXPECTED_ACCOUNT_ID}" ]]
then
  echo "Creds configured for the wrong account"
  echo "Expected: ${EXPECTED_ACCOUNT_ID}"
  echo "Got: ${ACTUAL_ACCOUNT_ID}"
  exit 1
fi