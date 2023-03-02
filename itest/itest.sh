#!/bin/bash
set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.1.0 --suffix app)
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "BucketName"))[0].OutputValue' | \
  tr -d \")
CONTENT_DATA="$(aws s3 cp s3://${BUCKET_NAME}/content.json - | \
  jq '.Data' | \
  tr -d \")"
EXPECTED_DATA="Something"
if [[ "${CONTENT_DATA}" != "${EXPECTED_DATA}" ]]
then
  echo "Integration test failed. Expected content data:"
  echo "${EXPECTED_DATA}"
  echo "Got:"
  echo "${CONTENT_DATA}"
  exit 2
fi
