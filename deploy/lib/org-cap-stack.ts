import * as cdk from '@aws-cdk/core';
import * as apigateway from '@aws-cdk/aws-apigateway'
import * as lambda from '@aws-cdk/aws-lambda'
import { join } from "path"
import { Code } from '@aws-cdk/aws-lambda'

export class OrgCapStack extends cdk.Stack {
  constructor(scope: cdk.Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const backend = new lambda.Function(this, "org-topology-lambda", {
      functionName: 'org-topology-lambda',
      description: 'uses graphql to fetch data',
      runtime: lambda.Runtime.NODEJS_14_X,
      code: Code.fromAsset(join(__dirname, '..', '..', 'lambda', 'dist')),
      handler: "index.handleEvent"
    });

    new apigateway.LambdaRestApi(this, "org-topology-api", {
      handler: backend,
    });
  }
}
