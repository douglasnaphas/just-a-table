import * as crypto from "crypto";
import { roleName } from "./";
import exp from "constants";
const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
describe("rolename", () => {
  test.each([
    {
      repoOwner: "douglasnaphas",
      repoName: "just-a-table",
      prefix: "GitHubDeployer-",
      hashLength: 6,
      expected: "GitHubDeployer-73ac48",
    },
  ])(
    "$repoOwner / $repoName ($hashLength) -> $expected",
    ({ repoOwner, repoName, prefix, hashLength, expected }) => {
      expect(roleName({ repoOwner, repoName, prefix, hashLength })).toEqual(
        expected
      );
    }
  );
});
describe("just figuring out hashes", () => {
  test.each([
    {
      stringToHash: "ff",
      expected:
        "05a9bf223fedf80a9d0da5f73f5c191a665bf4a0a4a3e608f2f9e7d5ff23959c",
    },
    {
      stringToHash: "douglasnaphas",
      expected:
        "99b8db41da150a46afb435b9c2cbceffe1b3c4dafe93bd1440810e409f78a413",
    },
    {
      stringToHash: "just-a-table",
      expected:
        "33f91ae33b3b20d1fa1d0e514cb870c2301aaacd9b5e897a8ab89d4b0d96b0b7",
    },
    {
      stringToHash:
        "99b8db41da150a46afb435b9c2cbceffe1b3c4dafe93bd1440810e409f78a413" +
        "33f91ae33b3b20d1fa1d0e514cb870c2301aaacd9b5e897a8ab89d4b0d96b0b7",
      expected:
        "73ac48d6ad0450fbf1888bdb6675cb2fe917f706214dab5663cd69fcc743d080",
    },
  ])("hashing $stringToHash", ({ stringToHash, expected }) => {
    expect(sha256(stringToHash)).toEqual(expected);
  });
});
