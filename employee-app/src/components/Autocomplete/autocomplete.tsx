import { useRef, useEffect, useId } from "react";
import "./autocomplete.css";
import {
  useAsyncAutocomplete,
  type AutocompleteOption,
} from "../../hooks/useAsyncAutocomplete";

interface AutocompleteProps {
  id?: string;
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  fetchOptions: () => Promise<AutocompleteOption[]>;
  debounceMs?: number;
  placeholder?: string;
  disabled?: boolean;
  hasError?: boolean;
}

export default function Autocomplete({
  id: externalId,
  value,
  onChange,
  onBlur,
  fetchOptions,
  debounceMs = 300,
  placeholder,
  disabled,
  hasError,
}: AutocompleteProps) {
  const generatedId = useId();
  const inputId = externalId ?? generatedId;
  const listboxId = `${inputId}-listbox`;
  const containerRef = useRef<HTMLDivElement>(null);

  const {
    query,
    setQuery,
    allOptions,
    filteredOptions,
    isLoading,
    isOpen,
    setIsOpen,
    activeIndex,
    setActiveIndex,
    fetchOnce,
  } = useAsyncAutocomplete({ fetchFn: fetchOptions, debounceMs });

  useEffect(() => {
    setQuery(value);
  }, [value, setQuery]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [setIsOpen]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value;
    setQuery(v);
    onChange(v);
    setActiveIndex(-1);
    setIsOpen(true);
    fetchOnce();
  };

  const handleFocus = () => {
    fetchOnce();
    setIsOpen(true);
    setActiveIndex(-1);
  };

  const handleBlur = () => {
    setTimeout(() => {
      setIsOpen(false);
      const matched = allOptions.find(
        (o) => o.label.toLowerCase() === query.toLowerCase(),
      );
      if (!matched) {
        setQuery("");
        onChange("");
      }
      onBlur?.();
    }, 150);
  };

  const handleSelect = (option: AutocompleteOption) => {
    setQuery(option.label);
    onChange(option.label);
    setIsOpen(false);
    setActiveIndex(-1);
  };

  return (
    <div
      ref={containerRef}
      className={`autocomplete${hasError ? " autocomplete--error" : ""}`}
    >
      <div className="autocomplete__input-wrapper">
        <input
          id={inputId}
          type="text"
          className="autocomplete__input"
          value={query}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onBlur={handleBlur}
          placeholder={placeholder}
          disabled={disabled}
          autoComplete="off"
          role="combobox"
          aria-expanded={isOpen}
          aria-controls={listboxId}
          aria-haspopup="listbox"
          aria-activedescendant={
            activeIndex >= 0 ? `${listboxId}-option-${activeIndex}` : undefined
          }
          aria-autocomplete="list"
        />
        {isLoading && (
          <span
            className="autocomplete__spinner"
            aria-label="Loading options"
            role="status"
          />
        )}
      </div>

      {isOpen && (
        <ul
          id={listboxId}
          className="autocomplete__listbox"
          role="listbox"
          aria-label="Department options"
        >
          {filteredOptions.length === 0 ? (
            <li
              className="autocomplete__empty"
              role="option"
              aria-selected={false}
            >
              {isLoading ? "Loading…" : "No options found"}
            </li>
          ) : (
            filteredOptions.map((option, index) => (
              <li
                key={option.id}
                id={`${listboxId}-option-${index}`}
                role="option"
                aria-selected={index === activeIndex}
                className={`autocomplete__option${
                  index === activeIndex ? " autocomplete__option--active" : ""
                }`}
                onMouseDown={() => handleSelect(option)}
              >
                {option.label}
              </li>
            ))
          )}
        </ul>
      )}
    </div>
  );
}
