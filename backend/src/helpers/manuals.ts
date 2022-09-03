import { ManualsAccess } from './manualsAcess'
import { AttachmentUtils } from './attachmentUtils';
import { ManualItem } from '../models/ManualItem'
import { CreateManualRequest } from '../requests/CreateManualRequest'
import { UpdateManualRequest } from '../requests/UpdateManualRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


const logger = createLogger('manuals');

const manualsaccess = new ManualsAccess()

const attachmentUtils = new AttachmentUtils()

export async function getManualsForUser(userId: string): Promise<ManualItem[]> {
  logger.log({
    level: 'info',
    message: 'Retrieving Manuals'
  })
  return manualsaccess.getAllManuals(userId)
}

export async function createManual(
  CreateManualRequest: CreateManualRequest,
  userId: string
): Promise<ManualItem> {
  logger.log({
    level: 'info',
    message: 'Creating Manual'
  })
  const manualId = uuid.v4()
  const manual = {
    manualId,
    userId,
    name: CreateManualRequest.name,
    addDate: CreateManualRequest.addDate,
    createdAt: new Date().toISOString(),
    done: false
  }

  return ManualsAccess.createManual(manual)
}

export async function updateManual(
  UpdateManualRequest: UpdateManualRequest,
  manualId: string,
  userId: string
): Promise<void> {
  logger.log({
    level: 'info',
    message: 'Updating Manual'
  })
  return ManualsAccess.updateManual(manualId, userId, UpdateManualRequest)
}

export async function deleteManual(
  manualId: string,
  userId: string
): Promise<void> {
  return ManualsAccess.deleteManual(manualId, userId)
}

export async function createAttachmentPresignedUrl(
  manualId: string,
  userId: string
): Promise<string> {
  await ManualsAccess.updatemanualUrl(manualId, userId)

  return attachmentUtils.generatePresignedUrl(manualId)
}