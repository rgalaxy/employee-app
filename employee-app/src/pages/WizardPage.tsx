import "./wizard.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useWizardForm, STEP_1_FIELDS } from "../hooks/useWizardForm";
import { useDraftPersistence } from "../hooks/useDraftPersistence";
import { useRole } from "../context/RoleContext";
import Stepper from "../components/Stepper/stepper";
import { postBasicInfo } from "../services/basicInfoService";
import { postDetails } from "../services/detailsService";
import WizardStep1 from "./WizardStep1";
import WizardStep2 from "./WizardStep2";

const WIZARD_STEPS = ["Basic Info", "Details"];

export default function WizardPage() {
  const navigate = useNavigate();
  const { role } = useRole();
  const { form, step, setStep } = useWizardForm(role);
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

  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (role === "Ops") {
      const step1Valid = await form.trigger(STEP_1_FIELDS);
      if (!step1Valid) {
        setSubmitError(
          "Basic Info (Step 1) is incomplete. Please ask an Admin to fill it first.",
        );
        return;
      }
    }
    handleSubmit(onSubmit)(e);
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
        <form className="wizard__form" onSubmit={handleFormSubmit} noValidate>
          {step === 0 && (
            <WizardStep1
              register={register}
              control={control}
              errors={errors}
              onNext={handleNext}
              onClearDraft={clearDraft}
            />
          )}
          {step === 1 && (
            <WizardStep2
              register={register}
              control={control}
              errors={errors}
              isSubmitting={isSubmitting}
              submitError={submitError}
              role={role}
              onBack={() => setStep(0)}
            />
          )}
        </form>
      </div>
    </div>
  );
}
