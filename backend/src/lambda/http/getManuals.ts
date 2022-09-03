import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'

import { getManualsForUser as getManualsForUser } from '../../helpers/manuals'
import { getUserId } from '../utils';
import { createLogger } from "../../utils/logger"

const logger = createLogger('getManuals');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing getManuals event', { event })
    const userId = getUserId(event)
    const manuals = await getManualsForUser(userId)

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        items: manuals
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)
