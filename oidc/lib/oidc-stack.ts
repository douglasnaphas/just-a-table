import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  GithubActionsIdentityProvider,
  GithubActionsRole,
} from "aws-cdk-github-oidc";
import * as iam from "aws-cdk-lib/aws-iam";

export interface OidcStackProps extends cdk.StackProps {
  deployRoleName: string;
}
export class OidcStack extends cdk.Stack {
  constructor(scope: cdk.App, id: string, props: OidcStackProps) {
    super(scope, id, props);
    const { deployRoleName } = props;
    const provider = new GithubActionsIdentityProvider(this, "GithubProvider");
    const deployRole = new GithubActionsRole(this, "DeployRole", {
      roleName: deployRoleName,
      provider: provider,
      owner: process.env.GITHUB_REPOSITORY_OWNER || "",
      repo: process.env.GITHUB_REPOSITORY?.split("/")[1] || "",
    });
    deployRole.addManagedPolicy(
      iam.ManagedPolicy.fromAwsManagedPolicyName("AdministratorAccess")
    );
  }
}
