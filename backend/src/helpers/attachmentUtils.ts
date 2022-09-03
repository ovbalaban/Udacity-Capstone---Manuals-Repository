import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'

const XAWS = AWSXRay.captureAWS(AWS)

// TODO: Implement the fileStogare logic

export class AttachmentUtils {
    constructor(
      private readonly s3 = new XAWS.S3({ signatureVersion: 'v4' }),
      private readonly bucketName = process.env.ATTACHMENT_S3_BUCKET,
      private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
    ) {}
  
    generatePresignedUrl(manualId: string): string {
      return this.s3.getSignedUrl('putObject', {
        Bucket: this.bucketName,
        Key: manualId,
        Expires: this.urlExpiration
      })
    }
  }