import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  GithubActionsIdentityProvider,
  GithubActionsRole,
} from "aws-cdk-github-oidc";
// import * as sqs from 'aws-cdk-lib/aws-sqs';
import * as iam from "aws-cdk-lib/aws-iam";

export class OidcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props?: cdk.StackProps) {
    super(scope, id, props);
    const provider = new GithubActionsIdentityProvider(this, "GithubProvider");
    const deployRole = new GithubActionsRole(this, "DeployRole", {
      provider: provider,
      owner: process.env.GITHUB_REPOSITORY_OWNER || "",
      repo: process.env.GITHUB_REPOSITORY?.split("/")[1] || "",
    });
    deployRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
  }
}
