#!/bin/bash
if [[ \
  -z "${AWS_ACCESS_KEY_ID}" || \
  -z "${AWS_SECRET_ACCESS_KEY}" || \
  -z "${AWS_SESSION_TOKEN}" || \
  -z "${AWS_DEFAULT_REGION}" || \
  -z "${EXPECTED_ACCOUNT_ID}" || \
  -z "${DEPLOY_ROLE_NAME}"
]]
then
  echo "Missing required environment variable. AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, AWS_SESSION_TOKEN, AWS_DEFAULT_REGION EXPECTED_ACCOUNT_ID, and DEPLOY_ROLE_NAME are required."
  exit 2
fi
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