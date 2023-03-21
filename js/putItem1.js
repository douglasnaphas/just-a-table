const {
  CloudFormationClient,
  DescribeStacksCommand,
} = require("@aws-sdk/client-cloudformation");
const {
  DynamoDBDocumentClient,
  PutCommand,
  GetCommand,
  UpdateCommand,
} = require("@aws-sdk/lib-dynamodb");
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
    const ARBITRARY_NONZERO_NUMBER = 4;
    process.exit(ARBITRARY_NONZERO_NUMBER);
  }
  tableName = describeStacksOutput.Stacks[0].Outputs.find(
    (o) => o.OutputKey === "TableName"
  ).OutputValue;
  console.log(tableName);

  // put item
  const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  let gameCode = "";
  const GAME_CODE_LENGTH = 12;
  while (gameCode.length < GAME_CODE_LENGTH) {
    gameCode += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  const putTime = new Date().toString();
  const putParams = {
    TableName: tableName,
    Item: {
      PK: gameCode,
      SK: "game-code",
      dateTime: putTime,
    },
    ConditionExpression: "attribute_not_exists(PK)",
  };
  console.log(`about to put gameCode ${gameCode}`);
  try {
    const putResponse = await ddbDocClient.send(new PutCommand(putParams));
    console.log(`successfully wrote gameCode ${gameCode} at ${putTime}`);
  } catch (error) {
    console.error("Failed to put item");
    console.error(error);
    const ARBITRARY_NONZERO_NUMBER = 5;
    process.exit(ARBITRARY_NONZERO_NUMBER);
  }

  // Get the item we just put
  const getParams = {
    TableName: tableName,
    Key: {
      PK: gameCode,
      SK: "game-code",
    },
  };
  try {
    const getResponse = await ddbDocClient.send(new GetCommand(getParams));
    console.log("got item, item:");
    console.log(getResponse.Item);
  } catch (error) {
    console.error("Failed to get item, error:");
    console.error(error);
    const ARBITRARY_NONZERO_NUMBER = 7;
    process.exit(ARBITRARY_NONZERO_NUMBER);
  }

  // Create a new list with SET
  const addToListParams1 = {
    TableName: tableName,
    Key: {
      PK: gameCode,
      SK: "game-code",
    },
    UpdateExpression: "SET #lt = :nl",
    ExpressionAttributeNames: { "#lt": "ListThings" },
    ExpressionAttributeValues: { ":nl": ["some-string-number-1"] },
    ConditionExpression: "attribute_not_exists(#lt)",
    ReturnValues: "ALL_NEW",
  };
  try {
    const updateResponse = await ddbDocClient.send(
      new UpdateCommand(addToListParams1)
    );
    console.log("updated item, response:");
    console.log(updateResponse);
  } catch (error) {
    console.error("Failed to update item, error:");
    console.error(error);
    const ARBITRARY_NONZERO_NUMBER = 9;
    process.exit(ARBITRARY_NONZERO_NUMBER);
  }
})();
