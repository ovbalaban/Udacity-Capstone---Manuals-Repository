import { apiEndpoint } from '../config'
import { Manual } from '../types/Manual';
import { CreateManualRequest } from '../types/CreateManualRequest';
import Axios from 'axios'
import { UpdateManualRequest } from '../types/UpdateManualRequest';

export async function getManuals(idToken: string): Promise<Manual[]> {
  console.log('Fetching manuals')

  const response = await Axios.get(`${apiEndpoint}/manuals`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    },
  })
  console.log('Manuals:', response.data)
  return response.data.items
}

export async function createManual(
  idToken: string,
  newManual: CreateManualRequest
): Promise<Manual> {
  const response = await Axios.post(`${apiEndpoint}/manuals`,  JSON.stringify(newManual), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.item
}

export async function patchManual(
  idToken: string,
  manualId: string,
  updatedManual: UpdateManualRequest
): Promise<void> {
  await Axios.patch(`${apiEndpoint}/manuals/${manualId}`, JSON.stringify(updatedManual), {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function deleteManual(
  idToken: string,
  manualId: string
): Promise<void> {
  await Axios.delete(`${apiEndpoint}/manuals/${manualId}`, {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
}

export async function getUploadUrl(
  idToken: string,
  manualId: string
): Promise<string> {
  const response = await Axios.post(`${apiEndpoint}/manuals/${manualId}/attachment`, '', {
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${idToken}`
    }
  })
  return response.data.uploadUrl
}

export async function uploadFile(uploadUrl: string, file: Buffer): Promise<void> {
  await Axios.put(uploadUrl, file)
}
