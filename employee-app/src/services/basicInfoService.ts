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

export interface BasicInfoRecord extends BasicInfoPayload {
  id: string
}

export interface PaginatedResult<T> {
  data: T[]
  total: number
}

interface JsonServerPage<T> {
  data: T[]
  items: number
  pages: number
}

export async function getBasicInfoCount(): Promise<number> {
  const response = await fetch(`${BASE_URL}/basicInfo?_page=1&_per_page=1`)
  if (!response.ok) return 0
  const json = await response.json() as JsonServerPage<BasicInfoRecord> | BasicInfoRecord[]
  if (Array.isArray(json)) return json.length
  return json.items
}

export async function getBasicInfoList(
  page: number,
  limit: number
): Promise<PaginatedResult<BasicInfoRecord>> {
  const response = await fetch(`${BASE_URL}/basicInfo?_page=${page}&_per_page=${limit}`)

  if (!response.ok) {
    throw new Error(`Failed to fetch employees: ${response.status} ${response.statusText}`)
  }

  const json = await response.json() as JsonServerPage<BasicInfoRecord> | BasicInfoRecord[]
  if (Array.isArray(json)) { // guard for non-paginated response
    return { data: json, total: json.length }
  }
  return { data: json.data, total: json.items }
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
