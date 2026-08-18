import { useEffect, useId, useRef } from "react";

export default function TextInput({
  label,
  name,
  type = "text",
  value,
  onChange,
  onBlur,
  error,
  hint,
  placeholder = "",
  autoComplete,
  autoFocus = false,
}) {
  const inputRef = useRef(null);
  const generatedId = useId();
  const inputId = name || generatedId;
  const descriptionId = `${inputId}-description`;

  useEffect(() => {
    if (autoFocus) inputRef.current?.focus();
  }, [autoFocus]);

  return (
    <div className={`input-group${error ? " has-error" : ""}`}>
      <label htmlFor={inputId}>{label}</label>
      <input ref={inputRef} id={inputId} name={name} type={type} value={value} onChange={onChange} onBlur={onBlur} placeholder={placeholder} autoComplete={autoComplete} aria-invalid={Boolean(error)} aria-describedby={error || hint ? descriptionId : undefined} />
      {(error || hint) && <p id={descriptionId} className={error ? "error-message" : "field-hint"}>{error || hint}</p>}
    </div>
  );
}
