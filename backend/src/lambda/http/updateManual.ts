import 'source-map-support/register'

import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import * as middy from 'middy'
import { cors, httpErrorHandler } from 'middy/middlewares'

import { updateManual } from '../../helpers/manuals'
import { UpdateManualRequest } from '../../requests/UpdateManualRequest'
import { getUserId } from '../utils'
import { createLogger } from "../../utils/logger"

const logger = createLogger('updateManual');


export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    logger.info('Processing updateManual event', { event })
    const manualId = event.pathParameters.manualId
    const updatedTodo: UpdateManualRequest = JSON.parse(event.body)
    const userId: string = getUserId(event)
    await updateManual(updatedTodo, manualId, userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({})
    }
  }
)

handler.use(httpErrorHandler()).use(
  cors({
    credentials: true
  })
)
