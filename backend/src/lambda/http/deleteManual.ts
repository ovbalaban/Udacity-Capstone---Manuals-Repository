import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { deleteManual } from '../../helpers/manuals'
import { getUserId } from '../utils'
import { createLogger } from "../../utils/logger"

const logger = createLogger('deleteManual');


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const manualId = event.pathParameters.manualId

    logger.info('Processing deleteManual event', { event })
    const userId = getUserId(event)
    await deleteManual(manualId, userId)

    return {
      statusCode: 204,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }
)

handler
  .use(httpErrorHandler())
  .use(
    cors({
      credentials: true
    })
  )
