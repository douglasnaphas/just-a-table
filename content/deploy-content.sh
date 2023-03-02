#!/bin/bash
set -e
STACKNAME=$(npx @cdk-turnkey/stackname@1.1.0 --suffix app)
BUCKET_NAME=$(aws cloudformation describe-stacks \
  --stack-name ${STACKNAME} | \
  jq '.Stacks[0].Outputs | map(select(.OutputKey == "BucketName"))[0].OutputValue' | \
  tr -d \")
mkdir -p deploy
cp *.json deploy/
aws s3 sync \
  --content-type "application/json" \
  --delete \
  deploy/ \
  s3://${BUCKET_NAME}
