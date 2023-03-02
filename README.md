# Just A Bucket

This repo contains:
  * AWS S3 bucket, codified using the [AWS Cloud Development Kit (CDK)](https://docs.aws.amazon.com/cdk/api/latest/docs/aws-construct-library.html);
  * CI code to deploy it to a test and prod account, with example contents;
  * CI code to deploy development instances of it to forks of this repo on development branches;
  * CI code to integration-test it;
  * Code to configure the CDK stack by reading [SSM parameters](https://docs.aws.amazon.com/systems-manager/latest/userguide/systems-manager-parameter-store.html) from the accounts where it's deployed.

It is meant to be used as a template for when you want some AWS resources, as code, with pre-built machinery for deployment and testing.
