import { useState, useCallback, useRef, useMemo } from 'react'
import { useDebounce } from './useDebounce'

export interface AutocompleteOption {
  id: string
  label: string
}

interface UseAsyncAutocompleteOptions {
  fetchFn: () => Promise<AutocompleteOption[]>
  debounceMs?: number
}

export function useAsyncAutocomplete({
  fetchFn,
  debounceMs = 300,
}: UseAsyncAutocompleteOptions) {
  const [allOptions, setAllOptions] = useState<AutocompleteOption[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [activeIndex, setActiveIndex] = useState(-1)
  const [query, setQuery] = useState('')

  const hasFetchedRef = useRef(false)
  const fetchFnRef = useRef(fetchFn)
  fetchFnRef.current = fetchFn

  const debouncedQuery = useDebounce(query, debounceMs)

  const filteredOptions = useMemo(() => {
    if (!debouncedQuery.trim()) return allOptions
    return allOptions.filter((o) =>
      o.label.toLowerCase().includes(debouncedQuery.toLowerCase()),
    )
  }, [allOptions, debouncedQuery])

  const fetchOnce = useCallback(async () => {
    if (hasFetchedRef.current) return
    hasFetchedRef.current = true
    setIsLoading(true)
    try {
      const options = await fetchFnRef.current()
      setAllOptions(options)
    } catch {
      setAllOptions([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  return {
    query,
    setQuery,
    filteredOptions,
    isLoading,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    fetchOnce,
  }
}
