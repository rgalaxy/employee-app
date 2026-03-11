import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { getBasicInfoCount } from '../services/basicInfoService'
import type { Role } from '../context/RoleContext'

export const wizardStep1Schema = z.object({
  fullName: z
    .string()
    .min(3, 'Full name must be at least 3 characters')
    .regex(/^[a-zA-Z\s]+$/, 'Full name must contain letters only'),
  email: z
    .string()
    .min(3, 'Email must be at least 3 characters')
    .email('Enter a valid email address'),
  department: z.string().min(1, 'Department is required'),
  role: z.enum(['Ops', 'Admin', 'Engineer', 'Finance'], {
    error: () => 'Select a role',
  }),
  employeeId: z.string().min(1),
})

export const wizardFormSchema = wizardStep1Schema.extend({
  photo: z.string().min(1, 'Photo is required'),
  employmentType: z.enum(['Full-time', 'Part-time', 'Contract', 'Intern'], {
    error: () => 'Select an employment type',
  }),
  officeLocation: z.string().min(1, 'Office location is required'),
  notes: z.string().optional(),
})

export type WizardStep1Values = z.infer<typeof wizardStep1Schema>
export type WizardFormValues = z.infer<typeof wizardFormSchema>

export const STEP_1_FIELDS: (keyof WizardStep1Values)[] = [
  'fullName',
  'email',
  'department',
  'role',
  'employeeId',
]

export const WIZARD_DEFAULTS: WizardFormValues = {
  fullName: '',
  email: '',
  department: '',
  role: '' as WizardStep1Values['role'],
  employeeId: '',
  photo: '',
  employmentType: '' as WizardFormValues['employmentType'],
  officeLocation: '',
  notes: '',
}

export function useWizardForm(role: Role = 'Admin') {
  const [step, setStep] = useState(() => (role === 'Ops' ? 1 : 0))
  const [existingCount, setExistingCount] = useState(0)

  useEffect(() => {
    setStep(role === 'Ops' ? 1 : 0)
  }, [role])

  useEffect(() => {
    getBasicInfoCount().then(setExistingCount).catch(() => {})
  }, [])

  const form = useForm<WizardFormValues>({
    resolver: zodResolver(wizardFormSchema),
    mode: 'onChange',
    defaultValues: WIZARD_DEFAULTS,
  })

  const department = form.watch('department')

  useEffect(() => {
    const prefix = (department ?? '').trim().slice(0, 3).toUpperCase()
    const id = prefix ? `${prefix}-${String(existingCount + 1).padStart(3, '0')}` : ''
    form.setValue('employeeId', id, { shouldValidate: true })
  }, [department, existingCount, form])

  return { form, step, setStep }
}
