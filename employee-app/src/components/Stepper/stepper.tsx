import './stepper.css'

interface StepperProps {
  steps: string[]
  currentStep: number
}

export default function Stepper({ steps, currentStep }: StepperProps) {
  return (
    <div className="stepper" aria-label="Form progress">
      {steps.map((label, index) => {
        const isCompleted = index < currentStep
        const isActive = index === currentStep

        let modifier = ''
        if (isCompleted) modifier = 'stepper__step--completed'
        else if (isActive) modifier = 'stepper__step--active'
        else modifier = 'stepper__step--inactive'

        return (
          <div key={label} className={`stepper__step ${modifier}`}>
            <div className="stepper__indicator" aria-hidden="true">
              {isCompleted ? (
                <svg className="stepper__check" viewBox="0 0 12 12" fill="none">
                  <path d="M2 6l3 3 5-5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              ) : (
                <span className="stepper__number">{index + 1}</span>
              )}
            </div>
            <span className="stepper__label">{label}</span>
            {index < steps.length - 1 && (
              <div className={`stepper__connector${isCompleted ? ' stepper__connector--done' : ''}`} aria-hidden="true" />
            )}
          </div>
        )
      })}
    </div>
  )
}
