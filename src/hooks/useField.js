import { useState } from "react";

export default function useField(validateValue, initialValue = "") {
  const [value, setValue] = useState(initialValue);
  const [error, setError] = useState("");
  const [touched, setTouched] = useState(false);

  function onChange(event) {
    const nextValue = event.target.value;
    setValue(nextValue);
    if (touched) setError(validateValue(nextValue));
  }

  function onBlur() {
    setTouched(true);
    setError(validateValue(value));
  }

  function validate() {
    const nextError = validateValue(value);
    setTouched(true);
    setError(nextError);
    return nextError;
  }

  return { value, error, onChange, onBlur, validate };
}
