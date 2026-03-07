import "./wizard.css";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Controller } from "react-hook-form";
import { useWizardForm, STEP_1_FIELDS } from "../hooks/useWizardForm";
import { useDraftPersistence } from "../hooks/useDraftPersistence";
import { useRole } from "../context/RoleContext";
import Stepper from "../components/Stepper/stepper";
import FormField from "../components/FormField/form-field";
import Autocomplete from "../components/Autocomplete/autocomplete";
import PhotoUpload from "../components/PhotoUpload/photo-upload";
import Button from "../components/Button/button";
import { getDepartments, postBasicInfo } from "../services/basicInfoService";
import { getLocations, postDetails } from "../services/detailsService";
import type { AutocompleteOption } from "../hooks/useAsyncAutocomplete";

const WIZARD_STEPS = ["Basic Info", "Details"];
const ROLES = ["Ops", "Admin", "Engineer", "Finance"] as const;
const EMPLOYMENT_TYPES = [
  "Full-time",
  "Part-time",
  "Contract",
  "Intern",
] as const;

async function fetchDepartmentOptions(): Promise<AutocompleteOption[]> {
  const departments = await getDepartments();
  return departments.map((d) => ({ id: d.id, label: d.name }));
}

async function fetchLocationOptions(): Promise<AutocompleteOption[]> {
  const locations = await getLocations();
  return locations.map((l) => ({ id: l.id, label: l.name }));
}

export default function WizardPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { form, step, setStep } = useWizardForm();
  const { clearDraft } = useDraftPersistence(form, role);
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = form;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handleNext = async () => {
    const valid = await form.trigger(STEP_1_FIELDS);
    if (valid) setStep(1);
  };

  const onSubmit = async () => {
    const values = form.getValues();
    setIsSubmitting(true);
    setSubmitError(null);
    try {
      const [, detailsResult] = await Promise.all([
        postBasicInfo({
          fullName: values.fullName,
          email: values.email,
          department: values.department,
          role: values.role,
          employeeId: values.employeeId,
        }),
        postDetails({
          employeeId: values.employeeId,
          photo: values.photo,
          employmentType: values.employmentType,
          officeLocation: values.officeLocation,
          notes: values.notes,
        }),
      ]);
      if (!detailsResult.success) {
        setSubmitError(detailsResult.message);
        setIsSubmitting(false);
        return;
      }
      clearDraft();
      navigate("/employee-list");
    } catch (err) {
      setSubmitError(
        err instanceof Error
          ? err.message
          : "Submission failed. Please try again.",
      );
      setIsSubmitting(false);
    }
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
          {step === 0 && (
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
                <Button type="button" variant="ghost" onClick={clearDraft}>
                  Clear Draft
                </Button>
                <Button type="button" onClick={handleNext}>
                  Next
                </Button>
              </div>
            </>
          )}

          {step === 1 && (
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
                    />
                  )}
                />
              </FormField>

              <FormField
                label="Employment Type"
                as="select"
                error={errors.employmentType?.message}
                required
                selectProps={register("employmentType")}
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
                  ...register("notes"),
                }}
              />

              {submitError && (
                <p className="wizard__submit-error">{submitError}</p>
              )}
              <div className="wizard__form-footer">
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setStep(0)}
                  disabled={isSubmitting}
                >
                  Back
                </Button>
                <Button type="submit" disabled={isSubmitting}>
                  {isSubmitting ? "Submitting…" : "Submit"}
                </Button>
              </div>
            </>
          )}
        </form>
      </div>
    </div>
  );
}
