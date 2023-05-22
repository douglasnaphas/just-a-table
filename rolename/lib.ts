import * as crypto from "crypto";
const sha256 = (content: string) =>
  crypto.createHash("sha256").update(content).digest("hex").toLowerCase();
export function roleName(props: {
  repoOwner: string;
  repoName: string;
  prefix: string;
  hashLength: number;
}) {
  const { repoOwner, repoName, prefix, hashLength } = props;
  return `${prefix}${sha256(sha256(repoOwner) + sha256(repoName)).substring(
    0,
    hashLength
  )}`;
}
