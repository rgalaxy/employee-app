import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const EXISTING_COUNT = 0

export const wizardStep1Schema = z.object({
  fullName: z.string().min(1, 'Full name is required'),
  email: z.string().min(1, 'Email is required').email('Enter a valid email address'),
  department: z.string().min(1, 'Department is required'),
  role: z.enum(['Ops', 'Admin', 'Engineer', 'Finance'], {
    error: () => 'Select a role',
  }),
  employeeId: z.string().min(1),
})

export type WizardStep1Values = z.infer<typeof wizardStep1Schema>

export function useWizardForm() {
  const [step, setStep] = useState(0)

  const form = useForm<WizardStep1Values>({
    resolver: zodResolver(wizardStep1Schema),
    mode: 'onChange',
    defaultValues: {
      fullName: '',
      email: '',
      department: '',
      role: '' as WizardStep1Values['role'],
      employeeId: '',
    },
  })

  const department = form.watch('department')

  useEffect(() => {
    const prefix = department.trim().slice(0, 3).toUpperCase()
    const id = prefix ? `${prefix}-${String(EXISTING_COUNT + 1).padStart(3, '0')}` : ''
    form.setValue('employeeId', id, { shouldValidate: true })
  }, [department, form])

  return { form, step, setStep }
}
