import * as cdk from "aws-cdk-lib";
import * as Lib from "../lib";

const OLD_ENV = process.env;
beforeEach(() => {
  jest.resetModules();
  process.env = { ...OLD_ENV };
});
afterAll(() => {
  process.env = { ...OLD_ENV };
});
test("can instantiate app stack", () => {
  const app = new cdk.App();
  process.env.GITHUB_REPOSITORY = "githubuser/repo-name";
  process.env.GITHUB_REF = "refs/heads/master";
  const stack = new Lib.AppStack(app, "MyTestApp");
});
