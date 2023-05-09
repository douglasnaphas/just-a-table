#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { OidcStack } from "../lib/oidc-stack";

const app = new cdk.App();
if (!process.env.DEPLOY_ROLE_NAME) {
  console.error("DEPLOY_ROLE_NAME must be specified");
  process.exit(1);
}
new OidcStack(app, "OidcStack", {
  deployRoleName: process.env.DEPLOY_ROLE_NAME,
});
