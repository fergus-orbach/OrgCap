import { expect as expectCDK, matchTemplate, MatchStyle } from '@aws-cdk/assert';
import * as cdk from '@aws-cdk/core';
import * as Deploy from '../lib/org-cap-stack';

test('Empty Stack', () => {
    const app = new cdk.App();
    // WHEN
    const stack = new Deploy.OrgCapStack(app, 'MyTestStack');
    // THEN
    expectCDK(stack).to(matchTemplate({
      "Resources": {}
    }, MatchStyle.EXACT))
});
