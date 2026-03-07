import { useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { Role } from '../context/RoleContext'
import { WIZARD_DEFAULTS, type WizardStep1Values } from './useWizardForm'

const DRAFT_KEYS: Record<Role, string> = {
  Admin: 'draft_admin',
  Ops: 'draft_ops',
}

function readDraft(key: string): WizardStep1Values | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as WizardStep1Values) : null
  } catch {
    return null
  }
}

export function useDraftPersistence(
  form: UseFormReturn<WizardStep1Values>,
  role: Role,
) {
  const draftKey = DRAFT_KEYS[role]
  const skipNextSaveRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    skipNextSaveRef.current = true
    const draft = readDraft(draftKey)
    form.reset(draft ?? WIZARD_DEFAULTS)
  }, [draftKey, form])

  useEffect(() => {
    const { unsubscribe } = form.watch((values) => {
      if (skipNextSaveRef.current) {
        skipNextSaveRef.current = false
        return
      }
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
      saveTimerRef.current = setTimeout(() => {
        localStorage.setItem(draftKey, JSON.stringify(values))
      }, 2000)
    })

    return () => {
      unsubscribe()
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current)
    }
  }, [form, draftKey])

  const clearDraft = () => {
    localStorage.removeItem(draftKey)
    form.reset(WIZARD_DEFAULTS)
  }

  return { clearDraft }
}

