// hooks/useField.js
import { useState } from "react";

export default function useField(validate) {
  const [value, setValue] = useState("");
  const [error, setError] = useState("");

  function onChange(e) {
    const v = e.target.value;
    setValue(v);
    setError(validate(v));
  }

  return { value, error, onChange };
}