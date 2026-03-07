import "./form-field.css";
import type {
  ReactNode,
  InputHTMLAttributes,
  SelectHTMLAttributes,
} from "react";

interface BaseProps {
  label: string;
  error?: string;
  required?: boolean;
}

interface InputFieldProps extends BaseProps {
  as?: "input";
  inputProps?: InputHTMLAttributes<HTMLInputElement>;
}

interface SelectFieldProps extends BaseProps {
  as: "select";
  children: ReactNode;
  selectProps?: SelectHTMLAttributes<HTMLSelectElement>;
}

type FormFieldProps = InputFieldProps | SelectFieldProps;

export default function FormField(props: FormFieldProps) {
  const { label, error, required } = props;
  const fieldId = label.toLowerCase().replace(/\s+/g, "-");
  const errorId = `${fieldId}-error`;

  return (
    <div className={`form-field${error ? " form-field--invalid" : ""}`}>
      <label className="form-field__label" htmlFor={fieldId}>
        {label}
        {required && (
          <span className="form-field__required" aria-hidden="true">
            {" "}
            *
          </span>
        )}
      </label>

      {props.as === "select" ? (
        <select
          id={fieldId}
          className="form-field__select"
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          {...props.selectProps}
        >
          {props.children}
        </select>
      ) : (
        <input
          id={fieldId}
          className={`form-field__input${props.inputProps?.disabled ? " form-field__input--disabled" : ""}`}
          aria-describedby={error ? errorId : undefined}
          aria-invalid={!!error}
          {...props.inputProps}
        />
      )}

      {error && (
        <span id={errorId} className="form-field__error" role="alert">
          {error}
        </span>
      )}
    </div>
  );
}
