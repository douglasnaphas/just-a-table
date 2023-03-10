const {
  CloudFormationClient,
  DescribeStacksCommand,
} = require("@aws-sdk/client-cloudformation");
const { DynamoDBDocumentClient } = require("@aws-sdk/lib-dynamodb");
const { DynamoDBClient } = require("@aws-sdk/client-dynamodb");
const stackname = require("@cdk-turnkey/stackname");

const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION;
const ddbClient = new DynamoDBClient({
  region: region,
});
const ddbDocClient = DynamoDBDocumentClient.from(ddbClient);

// get the table name
if (!process.env.GITHUB_REPOSITORY) {
  console.error(
    "Environment variable GITHUB_REPOSITORY must be set to use stackname."
  );
  console.error("It should be something like douglasnaphas/madliberation");
  const ARBITRARY_NONZERO_NUMBER = 2;
  process.exit(ARBITRARY_NONZERO_NUMBER);
}
if (!process.env.GITHUB_REF) {
  console.error(
    "Environment variable GITHUB_REF must be set to use stackname."
  );
  console.error("It should be something like refs/heads/451-link");
  const ARBITRARY_NONZERO_NUMBER = 3;
  process.exit(ARBITRARY_NONZERO_NUMBER);
}
const STACKNAME_HASH_LENGTH = 6;
const cloudFormationClient = new CloudFormationClient({ region });
console.log("region:");
console.log(region);
console.log("stackname:");
console.log(stackname("app", { hash: 6 }));
const describeStacksParams = {
  StackName: stackname("app", { hash: STACKNAME_HASH_LENGTH }),
};
const describeStacksCommand = new DescribeStacksCommand(describeStacksParams);
let tableName;
let describeStacksOutput;
(async () => {
  try {
    describeStacksOutput = await cloudFormationClient.send(
      describeStacksCommand
    );
  } catch (error) {
    console.error("Failed to describe stack");
    console.error(error);
  }
  tableName = describeStacksOutput.Stacks[0].Outputs.find(
    (o) => o.OutputKey === "TableName"
  ).OutputValue;
  console.log(tableName);
  
})();
