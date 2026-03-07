import "./wizard.css";
import { useWizardForm } from "../hooks/useWizardForm";
import Stepper from "../components/Stepper/stepper";
import FormField from "../components/FormField/form-field";
import Button from "../components/Button/button";

const WIZARD_STEPS = ["Basic Info", "Details"];
const ROLES = ["Ops", "Admin", "Engineer", "Finance"] as const;

export default function WizardPage() {
  const { form, step, setStep } = useWizardForm();
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = form;

  const onSubmit = () => {
    setStep(1);
  };

  return (
    <div className="wizard">
      <h1 className="wizard__title">Add Employee</h1>
      <Stepper steps={WIZARD_STEPS} currentStep={step} />
      <div className="wizard__card">
        <form
          className="wizard__form"
          onSubmit={handleSubmit(onSubmit)}
          noValidate
        >
          <FormField
            label="Full Name"
            error={errors.fullName?.message}
            required
            inputProps={{
              type: "text",
              placeholder: "e.g. John Doe",
              autoComplete: "name",
              ...register("fullName"),
            }}
          />

          <FormField
            label="Email"
            error={errors.email?.message}
            required
            inputProps={{
              type: "email",
              placeholder: "e.g. john@company.com",
              autoComplete: "email",
              ...register("email"),
            }}
          />

          <FormField
            label="Department"
            error={errors.department?.message}
            required
            inputProps={{
              type: "text",
              placeholder: "e.g. Engineering",
              ...register("department"),
            }}
          />

          <FormField
            label="Role"
            as="select"
            error={errors.role?.message}
            required
            selectProps={register("role")}
          >
            <option value="">Select a role</option>
            {ROLES.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </FormField>

          <FormField
            label="Employee ID"
            inputProps={{
              type: "text",
              readOnly: true,
              disabled: true,
              placeholder: "Auto-generated",
              ...register("employeeId"),
            }}
          />

          <div className="wizard__form-footer">
            <Button type="submit" disabled={!isValid}>
              Next
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
