export interface Location {
  id: string
  name: string
}

const BASE_URL = 'http://localhost:4002'

export async function getLocations(): Promise<Location[]> {
  const response = await fetch(`${BASE_URL}/locations`)

  if (!response.ok) {
    throw new Error(`Failed to fetch locations: ${response.status} ${response.statusText}`)
  }

  return response.json() as Promise<Location[]>
}
