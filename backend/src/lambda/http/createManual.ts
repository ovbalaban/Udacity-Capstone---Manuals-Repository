import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import 'source-map-support/register'
import * as middy from 'middy'
//import { cors } from 'middy/middlewares'
import { CreateManualRequest } from '../../requests/CreateManualRequest'
import { getUserId } from '../utils';
import { createManual } from '../../helpers/manuals'
import { createLogger } from "../../utils/logger"

const logger = createLogger('createManual');

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const newManual: CreateManualRequest = JSON.parse(event.body)


    logger.info('Processing createManual event', { event })

    const userId = getUserId(event)
    const manual = await createManual(newManual, userId)
    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Credentials': true
      },
      body: JSON.stringify({
        item: manual
      })
    }
  }
)
