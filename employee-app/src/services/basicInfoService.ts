import { delay } from '../utils'

export interface Department {
  id: string
  name: string
}

export interface BasicInfoPayload {
  fullName: string
  email: string
  department: string
  role: string
  employeeId: string
}

const BASE_URL = 'http://localhost:4001'

export async function getDepartments(): Promise<Department[]> {
  await delay(2000)
  const response = await fetch(`${BASE_URL}/departments`)

  if (!response.ok) {
    throw new Error(`Failed to fetch departments: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<Department[]>
}

export async function postBasicInfo(payload: BasicInfoPayload): Promise<void> {
  await delay(3000)
  const response = await fetch(`${BASE_URL}/basicInfo`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  if (!response.ok) {
    throw new Error(`Failed to post basic info: ${response.status} ${response.statusText}`)
  }
}
