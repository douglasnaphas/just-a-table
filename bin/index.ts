#!/usr/bin/env node
import { App } from "aws-cdk-lib";
const AWS = require("aws-sdk");
const crypto = require("crypto");
import { AppStack, AppStackProps } from "../lib";
const stackname = require("@cdk-turnkey/stackname");

(async () => {
  const app = new App();
  class ConfigParam {
    appParamName: string;
    ssmParamName = () => stackname(this.appParamName);
    ssmParamValue?: string;
    print = () => {
      console.log("appParamName");
      console.log(this.appParamName);
      console.log("ssmParamName:");
      console.log(this.ssmParamName());
      console.log("ssmParamValue:");
      console.log(this.ssmParamValue);
    };
    constructor(appParamName: string) {
      this.appParamName = appParamName;
    }
  }
  const configParams: Array<ConfigParam> = [new ConfigParam("customProp")];
  const ssmParams = {
    Names: configParams.map((c) => c.ssmParamName()),
    WithDecryption: true,
  };
  AWS.config.update({ region: process.env.AWS_DEFAULT_REGION });
  const ssm = new AWS.SSM();
  let ssmResponse: any;
  ssmResponse = await new Promise((resolve, reject) => {
    ssm.getParameters(ssmParams, (err: any, data: any) => {
      resolve({ err, data });
    });
  });
  if (!ssmResponse.data) {
    console.log("error: unsuccessful SSM getParameters call, failing");
    console.log(ssmResponse);
    process.exit(1);
  }
  const ssmParameterData: any = {};
  let valueHash;
  ssmResponse?.data?.Parameters?.forEach(
    (p: { Name: string; Value: string }) => {
      console.log("Received parameter named:");
      console.log(p.Name);
      valueHash = crypto
        .createHash("sha256")
        .update(p.Value)
        .digest("hex")
        .toLowerCase();
      console.log("value hash:");
      console.log(valueHash);
      console.log("**************");
      ssmParameterData[p.Name] = p.Value;
    }
  );
  console.log("==================");
  configParams.forEach((c) => {
    c.ssmParamValue = ssmParameterData[c.ssmParamName()];
  });
  const appProps: any = {};
  configParams.forEach((c) => {
    appProps[c.appParamName] = c.ssmParamValue;
  });
  // Param validation
  if (appProps.customProp) {
    // Validate the customProp, if provided
  }
  // TODO: print a hash of the IDP app secrets
  new AppStack(app, stackname("app"), {
    ...(appProps as AppStackProps),
  });
})();
