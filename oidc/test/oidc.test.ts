import * as cdk from "aws-cdk-lib";
import { Template } from "aws-cdk-lib/assertions";
import * as Oidc from "../lib/oidc-stack";

test("Can instantiate", () => {
  const app = new cdk.App();
  const stack = new Oidc.OidcStack(app, "MyTestStack", {
    deployRoleName: "MyDeployRole",
  });
});
