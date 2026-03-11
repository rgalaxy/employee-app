import { Controller } from "react-hook-form";
import type { Control, FieldErrors, UseFormRegister } from "react-hook-form";
import FormField from "../components/FormField/form-field";
import Autocomplete from "../components/Autocomplete/autocomplete";
import PhotoUpload from "../components/PhotoUpload/photo-upload";
import Button from "../components/Button/button";
import { getLocations } from "../services/detailsService";
import type { WizardFormValues } from "../hooks/useWizardForm";
import type { AutocompleteOption } from "../hooks/useAsyncAutocomplete";
import type { Role } from "../context/RoleContext";

const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
] as const;

async function fetchLocationOptions(): Promise<AutocompleteOption[]> {
  const locations = await getLocations();
  return locations.map((l) => ({ id: l.id, label: l.name }));
}

interface WizardStep2Props {
  register: UseFormRegister<WizardFormValues>;
  control: Control<WizardFormValues>;
  errors: FieldErrors<WizardFormValues>;
  isSubmitting: boolean;
  role: Role;
  onBack: () => void;
}

export default function WizardStep2({
  register,
  control,
  errors,
  isSubmitting,
  role,
  onBack,
}: WizardStep2Props) {
  return (
    <>
      <FormField
        label="Photo"
        as="custom"
        fieldId="photo"
        error={errors.photo?.message}
        required
      >
        <Controller
          name="photo"
          control={control}
          render={({ field }) => (
            <PhotoUpload
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              hasError={!!errors.photo}
              disabled={isSubmitting}
            />
          )}
        />
      </FormField>

      <FormField
        label="Employment Type"
        as="select"
        error={errors.employmentType?.message}
        required
        selectProps={{ ...register("employmentType"), disabled: isSubmitting }}
      >
        <option value="">Select employment type</option>
        {EMPLOYMENT_TYPES.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </FormField>

      <FormField
        label="Office Location"
        as="custom"
        fieldId="officeLocation"
        error={errors.officeLocation?.message}
        required
      >
        <Controller
          name="officeLocation"
          control={control}
          render={({ field }) => (
            <Autocomplete
              id="officeLocation"
              value={field.value}
              onChange={field.onChange}
              onBlur={field.onBlur}
              fetchOptions={fetchLocationOptions}
              debounceMs={300}
              placeholder="e.g. Jakarta"
              hasError={!!errors.officeLocation}
              disabled={isSubmitting}
            />
          )}
        />
      </FormField>

      <FormField
        label="Notes"
        as="textarea"
        textareaProps={{
          placeholder: "Any additional notes…",
          rows: 4,
          disabled: isSubmitting,
          ...register("notes"),
        }}
      />

      <div className="wizard__form-footer">
        {role !== "Ops" && (
          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            disabled={isSubmitting}
          >
            Back
          </Button>
        )}
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Submitting…" : "Submit"}
        </Button>
      </div>
    </>
  );
}
