#!/usr/bin/env node
import { roleName } from "./";
(async () => {
  const program = require("commander");
  type DefaultsType = {
    prefix: string;
  };
  const defaults: DefaultsType = {
    prefix: "",
  };
  program
    .name("rolename")
    .version("0.1.0")
    .description(
      "Print a name for an AWS role to be used with https://github.com/aripalo/aws-cdk-github-oidc. `npx . --repo-owner douglasnaphas --repo-name just-a-table --prefix 'GitHubDeployer-' --hash-length 6` prints 'GitHubDeployer-73ac48'"
    )
    .option("--repo-owner <REPO_OWNER>", "the repo owner, like 'douglasnaphas'")
    .option("--repo-name <REPO_NAME>", "the repo name, like 'just-a-table'")
    .option("-p, --prefix <PREFIX>", "A prefix to prepend to the rolename")
    .option(
      "-h, --hash-length <LENGTH>",
      "Append a fixed-length hash, the first LENGTH characters of sha256(sha256(repoOwner) + sha256(repoName)), to the rolename after a dash, to avoid truncating"
    )
    .parse(process.argv);
  const { repoOwner, repoName, prefix, hashLength } = program.opts();
  console.log(roleName({ repoOwner, repoName, prefix, hashLength }));
})().catch((err) => {
  console.error("rolename: error encountered:");
  console.error(err);
  process.exit(1);
});
