import { GithubActionsIdentityProvider, GithubActionsRole } from 'aws-cdk-github-oidc';
import * as cdk from 'aws-cdk-lib';
import { Duration } from 'aws-cdk-lib';
import { ManagedPolicy, PolicyDocument, PolicyStatement } from 'aws-cdk-lib/aws-iam';
import { Construct } from 'constructs';

export class IacStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const owner = process.env.REPO_OWNER
    const repo = process.env.REPO_NAME
    if(!owner || !repo) {
      throw new Error('REPO_OWNER and REPO_NAME environment variables must be set')
    }

    const provider = new GithubActionsIdentityProvider(this, 'GithubProvider');
    const deployRole = new GithubActionsRole(this, 'EcsDeployRole', {
      provider,
      owner,
      repo,
      maxSessionDuration: Duration.hours(2)
    });
    deployRole.addManagedPolicy(
      new ManagedPolicy(this, 'EcsDeployPolicy', {
        document: PolicyDocument.fromJson({
          "Version": "2012-10-17",
          "Statement": [
            {
              "Effect": "Allow",
              "Action": [
                "ecr:GetAuthorizationToken",
                "ecr:BatchGetImage",
                "ecr:BatchCheckLayerAvailability",
                "ecr:CompleteLayerUpload",
                "ecr:GetDownloadUrlForLayer",
                "ecr:InitiateLayerUpload",
                "ecr:PutImage",
                "ecr:UploadLayerPart",
                "ecs:DescribeTaskDefinition",
                "ecs:RegisterTaskDefinition",
                "ecs:UpdateService",
                "ecs:DescribeServices"
              ],
              "Resource": "*"
            },
            {
              "Effect": "Allow",
              "Action": ["iam:PassRole"],
              "Resource": "*",
              "Condition": {
                "StringLike": {
                  "iam:PassedToService": "ecs-tasks.amazonaws.com"
                }
              }
            }
          ]
        })
      })
    )
  }
}
