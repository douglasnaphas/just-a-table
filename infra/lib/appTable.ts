import {
  aws_dynamodb as dynamodb,
  RemovalPolicy,
  CfnOutput,
} from "aws-cdk-lib";
import { Construct } from "constructs";
const Schema = require("./schema");
const appTable: (construct: Construct) => dynamodb.Table = (
  construct: Construct
) => {
  const table = new dynamodb.Table(construct, "Table", {
    partitionKey: { name: Schema.PK, type: dynamodb.AttributeType.STRING },
    sortKey: { name: Schema.SK, type: dynamodb.AttributeType.STRING },
    billingMode: dynamodb.BillingMode.PAY_PER_REQUEST,
    removalPolicy: RemovalPolicy.DESTROY,
    stream: dynamodb.StreamViewType.NEW_AND_OLD_IMAGES,
  });
  new CfnOutput(construct, "TableName", {
    value: table.tableName,
  });
  new CfnOutput(construct, "TableArn", {
    value: table.tableArn,
  });
  return table;
};
module.exports = appTable;
