import AWS from 'aws-sdk'

import { handleEventInternal } from './lib'

AWS.config.update({ region: 'eu-west-1' })

export const handleEvent = async (event: any) => handleEventInternal(event)

