import { useId } from "react"

export default function TextInput({
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder = "",
}) {
    const id = useId();
    return (
        <div className="input-group">
            <label htmlFor={id}>{label}:</label>
            <input
                id={id}
                type={type}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />

            {error && <p className="error-message">{error}</p>}
        </div>
    )
}