import * as crypto from "crypto";
const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
describe.skip("rolename", () => {
  test.each([
    {
      repoOwner: "douglasnaphas",
      repoName: "just-a-table",
      prefix: "GitHubDeployer-",
      expected: "",
    },
  ]);
});
test("how hashes work", () => {
  expect(sha256("ff")).toEqual(
    "05a9bf223fedf80a9d0da5f73f5c191a665bf4a0a4a3e608f2f9e7d5ff23959c"
  );
});
