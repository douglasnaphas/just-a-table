const {
  SSMClient,
  GetParametersCommand,
  DescribeParametersCommand,
} = require("@aws-sdk/client-ssm");
(async () => {
  const client = new SSMClient({ region: "us-east-1" });
  const params = {};
  const command = new DescribeParametersCommand(params);
  const response = await client.send(command);
  console.log(response);
})();
