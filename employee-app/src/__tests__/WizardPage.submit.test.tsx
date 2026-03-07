import React from "react";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import "@testing-library/jest-dom";
import { MemoryRouter } from "react-router-dom";

import WizardPage from "../pages/WizardPage";
import { RoleProvider } from "../context/RoleContext";
import { useWizardForm } from "../hooks/useWizardForm";
import * as basicInfoService from "../services/basicInfoService";
import * as detailsService from "../services/detailsService";
import type { WizardFormValues } from "../hooks/useWizardForm";

const mockNavigate = jest.fn();
jest.mock("react-router-dom", () => ({
  ...jest.requireActual("react-router-dom"),
  useNavigate: () => mockNavigate,
}));

jest.mock("../hooks/useWizardForm", () => ({
  useWizardForm: jest.fn(),
  STEP_1_FIELDS: ["fullName", "email", "department", "role", "employeeId"],
}));

jest.mock("../hooks/useDraftPersistence", () => ({
  useDraftPersistence: jest.fn().mockReturnValue({ clearDraft: jest.fn() }),
}));

jest.mock("../services/basicInfoService", () => ({
  postBasicInfo: jest.fn(),
  getDepartments: jest.fn().mockResolvedValue([]),
}));
jest.mock("../services/detailsService", () => ({
  postDetails: jest.fn(),
  getLocations: jest.fn().mockResolvedValue([]),
}));

jest.mock("../components/Autocomplete/autocomplete", () => ({
  __esModule: true,
  default: ({
    onChange,
    placeholder,
    id,
  }: {
    onChange: (v: string) => void;
    placeholder?: string;
    id?: string;
  }) => (
    <input
      id={id}
      data-testid={`autocomplete-${id ?? "unknown"}`}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
    />
  ),
}));
jest.mock("../components/PhotoUpload/photo-upload", () => ({
  __esModule: true,
  default: ({ onChange }: { onChange: (v: string) => void }) => (
    <div
      data-testid="photo-upload"
      onClick={() => onChange("data:image/png;base64,stub")}
    />
  ),
}));

jest.mock("react-hook-form", () => ({
  __esModule: true,
  ...jest.requireActual("react-hook-form"),
  Controller: ({
    render: renderProp,
    name,
  }: {
    name: string;
    render: (p: {
      field: Partial<React.InputHTMLAttributes<HTMLInputElement>>;
    }) => React.ReactElement;
  }) =>
    renderProp({
      field: {
        value: name === "photo" ? "data:image/png;base64,stub" : "Mocked Value",
        onChange: jest.fn(),
        onBlur: jest.fn(),
      },
    }),
}));

const VALID_VALUES: WizardFormValues = {
  fullName: "Jane Smith",
  email: "jane@example.com",
  department: "Engineering",
  role: "Engineer",
  employeeId: "ENG-001",
  photo: "data:image/png;base64,stub",
  employmentType: "Full-time",
  officeLocation: "Jakarta",
  notes: "",
};

function buildMockForm() {
  return {
    register: (name: string) => ({
      name,
      ref: jest.fn(),
      onChange: jest.fn(),
      onBlur: jest.fn(),
    }),
    handleSubmit: (fn: () => Promise<void>) => async (e: React.FormEvent) => {
      e.preventDefault();
      await fn();
    },
    control: {},
    formState: { errors: {} },
    getValues: jest.fn().mockReturnValue(VALID_VALUES),
    trigger: jest.fn().mockResolvedValue(true),
    setValue: jest.fn(),
  };
}

function renderWizardAtStep(step: 0 | 1 = 1) {
  (useWizardForm as jest.Mock).mockReturnValue({
    form: buildMockForm(),
    step,
    setStep: jest.fn(),
  });

  return render(
    <MemoryRouter>
      <RoleProvider>
        <WizardPage />
      </RoleProvider>
    </MemoryRouter>,
  );
}

describe("WizardPage – submit flow", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("disable button while submitting", async () => {
    // Arrange
    let resolveBasic!: () => void;
    let resolveDetails!: (v: { success: boolean; message: string }) => void;

    (basicInfoService.postBasicInfo as jest.Mock).mockReturnValue(
      new Promise<void>((res) => {
        resolveBasic = res;
      }),
    );
    (detailsService.postDetails as jest.Mock).mockReturnValue(
      new Promise<{ success: boolean; message: string }>((res) => {
        resolveDetails = res;
      }),
    );

    renderWizardAtStep(1);
    const submitBtn = screen.getByRole("button", { name: /^submit$/i });

    // Assert – initial
    expect(submitBtn).not.toBeDisabled();

    // Act
    fireEvent.click(submitBtn);

    // Assert - final state
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /submitting/i }),
      ).toBeDisabled(),
    );
    expect(basicInfoService.postBasicInfo).toHaveBeenCalledTimes(1);
    expect(detailsService.postDetails).toHaveBeenCalledTimes(1);

    resolveBasic();
    resolveDetails({ success: true, message: "ok" });
  });

  it("navigates to /employee-list after both POSTs succeed", async () => {
    // Arrange
    (basicInfoService.postBasicInfo as jest.Mock).mockResolvedValue(undefined);
    (detailsService.postDetails as jest.Mock).mockResolvedValue({
      success: true,
      message: "Details submitted successfully.",
    });
    renderWizardAtStep(1);

    // Act
    fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByRole("button", { name: /submitting/i }),
      ).toBeInTheDocument(),
    );
    await waitFor(() =>
      expect(mockNavigate).toHaveBeenCalledWith("/employee-list"),
    );
    expect(basicInfoService.postBasicInfo).toHaveBeenCalledWith(
      expect.objectContaining({
        fullName: "Jane Smith",
        email: "jane@example.com",
        department: "Engineering",
        role: "Engineer",
        employeeId: "ENG-001",
      }),
    );
    expect(detailsService.postDetails).toHaveBeenCalledWith(
      expect.objectContaining({
        employeeId: "ENG-001",
        employmentType: "Full-time",
        officeLocation: "Jakarta",
      }),
    );
  });

  it("shows the error message and re-enables Submit when postDetails reports failure", async () => {
    // Arrange
    (basicInfoService.postBasicInfo as jest.Mock).mockResolvedValue(undefined);
    (detailsService.postDetails as jest.Mock).mockResolvedValue({
      success: false,
      message: "Server rejected the request",
    });
    renderWizardAtStep(1);

    // Act
    fireEvent.click(screen.getByRole("button", { name: /^submit$/i }));

    // Assert
    await waitFor(() =>
      expect(
        screen.getByText("Server rejected the request"),
      ).toBeInTheDocument(),
    );
    expect(mockNavigate).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: /^submit$/i }),
    ).not.toBeDisabled();
  });
});
