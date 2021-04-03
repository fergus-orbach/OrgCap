#!/usr/bin/env node
import 'source-map-support/register';
import * as cdk from '@aws-cdk/core';
import { OrgCapStack } from '../lib/org-cap-stack';

const app = new cdk.App();
new OrgCapStack(app, 'OrgCapStack');
