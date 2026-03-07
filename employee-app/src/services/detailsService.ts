import { delay } from '../utils'

export interface Location {
  id: string
  name: string
}

export interface DetailsPayload {
  employeeId: string
  photo: string
  employmentType: string
  officeLocation: string
  notes?: string
}

export interface DetailsRecord extends DetailsPayload {
  id: string
}

const BASE_URL = 'http://localhost:4002'

export async function getDetailsByEmployeeIds(employeeIds: string[]): Promise<DetailsRecord[]> {
  if (employeeIds.length === 0) return []
  const results = await Promise.all(
    employeeIds.map(async (employeeId) => {
      const response = await fetch(`${BASE_URL}/details?employeeId=${encodeURIComponent(employeeId)}`)
      if (!response.ok) return []
      return response.json() as Promise<DetailsRecord[]>
    })
  )
  return results.flat()
}

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${BASE_URL}/locations`)

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<Location[]>
}

export async function postDetails(payload: DetailsPayload): Promise<{ success: boolean; message: string }> {
  try {
    await delay(3000)
    const response = await fetch(`${BASE_URL}/details`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    })

    const text = await response.text().catch(() => '')
    let message: string
    try {
      // this can still error because response not always JSON
      const data = JSON.parse(text)
      message = data?.message ?? (response.ok ? 'Details submitted successfully.' : response.statusText)
    } catch {
      message = text.trim() || (response.ok ? 'Details submitted successfully.' : response.statusText)
    }

    if (!response.ok) {
      return { success: false, message }
    }

    return { success: true, message }
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred.'
    return { success: false, message }
  }
}
