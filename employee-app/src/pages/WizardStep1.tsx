import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import FormField from "../components/FormField/form-field";
import Autocomplete from "../components/Autocomplete/autocomplete";
import Button from "../components/Button/button";
import { getDepartments } from "../services/basicInfoService";
import type { WizardFormValues } from "../hooks/useWizardForm";
import type { AutocompleteOption } from "../hooks/useAsyncAutocomplete";

const ROLES = ["Ops", "Admin", "Engineer", "Finance"] as const;

async function fetchDepartmentOptions(): Promise<AutocompleteOption[]> {
  const departments = await getDepartments();
  return departments.map((d) => ({ id: d.id, label: d.name }));
}

interface WizardStep1Props {
  register: UseFormRegister<WizardFormValues>;
  control: Control<WizardFormValues>;
  errors: FieldErrors<WizardFormValues>;
  onNext: () => void;
  onClearDraft: () => void;
}

export default function WizardStep1({
  register,
  control,
  errors,
  onNext,
  onClearDraft,
}: WizardStep1Props) {
  return (
    <>
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
        as="custom"
        fieldId="department"
        error={errors.department?.message}
        required
      >
        <Controller
          name="department"
          control={control}
          render={({ field }) => (
            <Autocomplete
              id="department"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fetchOptions={fetchDepartmentOptions}
              debounceMs={300}
              placeholder="e.g. Engineering"
              hasError={!!errors.department}
            />
          )}
        />
      </FormField>

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
        <Button type="button" variant="ghost" onClick={onClearDraft}>
          Clear Draft
        </Button>
        <Button type="button" onClick={onNext}>
          Next
        </Button>
      </div>
    </>
  );
}
