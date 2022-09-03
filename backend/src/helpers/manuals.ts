import { ManualsAccess } from './manualsAcess'
import { AttachmentUtils } from './attachmentUtils';
import { ManualItem } from '../models/ManualItem'
import { CreateManualRequest } from '../requests/CreateManualRequest'
import { UpdateManualRequest } from '../requests/UpdateManualRequest'
import { createLogger } from '../utils/logger'
import * as uuid from 'uuid'


const logger = createLogger('manuals');

const manualsAccess = new ManualsAccess()

const attachmentUtils = new AttachmentUtils()

export async function getManualsForUser(userId: string): Promise<ManualItem[]> {
  logger.log({
    level: 'info',
    message: 'Getting Manuals'
  })
  return manualsAccess.getAllManuals(userId)
}

export async function createManual(
  createManualRequest: CreateManualRequest,
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
    name: createManualRequest.name,
    addDate: createManualRequest.addDate,
    createdAt: new Date().toISOString(),
    done: false
  }

  return manualsAccess.createManual(manual)
}

export async function updateManual(
  updateManualRequest: UpdateManualRequest,
  manualId: string,
  userId: string
): Promise<void> {
  logger.log({
    level: 'info',
    message: 'Updating Manual'
  })
  return manualsAccess.updateManual(manualId, userId, updateManualRequest)
}

export async function deleteManual(
  manualId: string,
  userId: string
): Promise<void> {
  return manualsAccess.deleteManual(manualId, userId)
}

export async function createAttachmentPresignedUrl(
  manualId: string,
  userId: string
): Promise<string> {
  await manualsAccess.updateManualUrl(manualId, userId)

  return attachmentUtils.generatePresignedUrl(manualId)
}