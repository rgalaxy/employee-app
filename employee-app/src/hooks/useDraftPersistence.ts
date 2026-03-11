import { useEffect, useRef } from 'react'
import type { UseFormReturn } from 'react-hook-form'
import type { Role } from '../context/RoleContext'
import { WIZARD_DEFAULTS, type WizardFormValues } from './useWizardForm'

const DRAFT_KEYS: Record<Role, string> = {
  Admin: 'draft_admin',
  Ops: 'draft_ops',
}

function readDraft(key: string): WizardFormValues | null {
  try {
    const raw = localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as WizardFormValues) : null
  } catch {
    return null
  }
}

export function useDraftPersistence(
  form: UseFormReturn<WizardFormValues>,
  role: Role,
) {
  const draftKey = DRAFT_KEYS[role]
  const skipNextSaveRef = useRef(false)
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  useEffect(() => {
    skipNextSaveRef.current = true
    const REQUIRED_FIELDS: (keyof WizardFormValues)[] = [
      'fullName', 'email', 'department', 'role', 'employeeId',
      'photo', 'employmentType', 'officeLocation',
    ]
    const draft = readDraft(draftKey)
    const hasPriorData = draft !== null && REQUIRED_FIELDS.every((f) => !!draft[f])
    if (role === 'Ops' && !hasPriorData) {
      const adminDraft = readDraft(DRAFT_KEYS['Admin'])
      form.reset(adminDraft ? { ...WIZARD_DEFAULTS, ...adminDraft } : WIZARD_DEFAULTS)
    } else {
      form.reset(draft ? { ...WIZARD_DEFAULTS, ...draft } : WIZARD_DEFAULTS)
    }
  }, [draftKey, role, form])

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

