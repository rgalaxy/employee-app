import { delay } from '../utils'

export interface Department {
  id: string
  name: string
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
