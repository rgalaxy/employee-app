import { useRef } from "react";
import "./photo-upload.css";
import Button from "../Button/button";

interface PhotoUploadProps {
  value: string;
  onChange: (base64: string) => void;
  onBlur?: () => void;
  hasError?: boolean;
  disabled?: boolean;
}

export default function PhotoUpload({
  value,
  onChange,
  onBlur,
  hasError,
  disabled,
}: PhotoUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result;
      if (typeof result === "string") {
        onChange(result);
      }
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.stopPropagation();
    onChange("");
    onBlur?.();
  };

  const handleTriggerClick = () => {
    if (!disabled) inputRef.current?.click();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      if (!disabled) inputRef.current?.click();
    }
  };

  return (
    <div
      className={[
        "photo-upload",
        hasError ? "photo-upload--error" : "",
        disabled ? "photo-upload--disabled" : "",
      ]
        .filter(Boolean)
        .join(" ")}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="photo-upload__input"
        onChange={handleFileChange}
        onBlur={onBlur}
        disabled={disabled}
        aria-hidden="true"
        tabIndex={-1}
      />

      {value ? (
        <div className="photo-upload__preview-wrapper">
          <img
            src={value}
            alt="Photo preview"
            className="photo-upload__preview"
          />
          <div className="photo-upload__preview-actions">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleTriggerClick}
              disabled={disabled}
            >
              Change
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="photo-upload__remove-btn"
              onClick={handleRemove}
              disabled={disabled}
            >
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <div
          className="photo-upload__trigger"
          onClick={handleTriggerClick}
          onKeyDown={handleKeyDown}
          role="button"
          tabIndex={disabled ? -1 : 0}
          aria-label="Upload photo"
          aria-disabled={disabled}
        >
          <span className="photo-upload__placeholder-icon" aria-hidden="true">
            <svg
              width="32"
              height="32"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <rect x="3" y="3" width="18" height="18" rx="3" ry="3" />
              <circle cx="8.5" cy="8.5" r="1.5" />
              <polyline points="21 15 16 10 5 21" />
            </svg>
          </span>
          <span className="photo-upload__placeholder-text">
            Click to upload photo
          </span>
          <span className="photo-upload__placeholder-hint">
            PNG, JPG, GIF up to 10 MB
          </span>
        </div>
      )}
    </div>
  );
}
