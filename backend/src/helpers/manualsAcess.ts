import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { createLogger } from '../utils/logger'
import { ManualItem } from '../models/ManualItem'
import { ManualUpdate } from '../models/ManualUpdate';
//import { S3 } from 'aws-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

const logger = createLogger('ManualsAccess')

const bucketName = process.env.ATTACHMENT_S3_BUCKET

export class ManualsAccess {
    constructor(
      private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
      private readonly manualsTable = process.env.MANUALS_TABLE
    ) {}
  
    async getAllManuals(userId: string): Promise<ManualItem[]> {
      logger.log({
        level: 'info',
        message: 'Getting all Manuals'
      })
  
      const result = await this.docClient
        .query({
          TableName: this.manualsTable,
          KeyConditionExpression: 'userId = :userId',
          ExpressionAttributeValues: {
            ':userId': userId
          },
          ScanIndexForward: false
        })
        .promise()
  
      const items = result.Items
      return items as ManualItem[]
    }
  
    async createManual(manual: ManualItem): Promise<ManualItem> {
      logger.log({
        level: 'info',
        message: 'Creating Manual'
      })
  
      await this.docClient
        .put({
          TableName: this.manualsTable,
          Item: manual
        })
        .promise()
  
      return manual
    }
  
    async updateManual(
      manualId: string,
      userId: string,
      manualUpdate: ManualUpdate
    ): Promise<void> {
      logger.log({
        level: 'info',
        message: 'Updating Manual'
      })
      await this.docClient
        .update({
          TableName: this.manualsTable,
          Key: {
            userId: userId,
            manualId: manualId
          },
          ExpressionAttributeNames: { '#N': 'name' },
          UpdateExpression: 'set #N =:n, addDate=:d, done=:s',
          ExpressionAttributeValues: {
            ':n': manualUpdate.name,
            ':d': manualUpdate.addDate
          },
          ReturnValues: 'NONE'
        })
        .promise()
    }
  
    async deleteManual(manualId: string, userId: string): Promise<void> {
      logger.log({
        level: 'info',
        message: 'Deleting Manual'
      })
      await this.docClient
        .delete({
          TableName: this.manualsTable,
          Key: {
            userId: userId,
            manualId: manualId
          }
        })
        .promise()
    }
    async updateManualUrl(manualId: string, userId: string): Promise<void> {
      logger.log({
        level: 'info',
        message: 'Updating Manual URL'
      })
      await this.docClient
        .update({
          TableName: this.manualsTable,
          Key: {
            userId: userId,
            manualId: manualId
          },
          UpdateExpression: 'set attachmentUrl = :a',
          ExpressionAttributeValues: {
            ':a': `https://${bucketName}.s3.amazonaws.com/${manualId}`
          },
          ReturnValues: 'UPDATED_NEW'
        })
        .promise()
    }
  }