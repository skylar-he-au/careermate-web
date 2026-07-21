import { useEffect, useId, useRef } from "react"

export default function TextInput({
    label,
    type = "text",
    value,
    onChange,
    error,
    placeholder = "",
    autoFocus = false,
}) {
    const inputRef = useRef(null);
    const id = useId();

    useEffect(()=>{
        if(autoFocus){
            inputRef.current?.focus();
        }
    },[autoFocus])

    return (
        <div className="input-group">
            <label htmlFor={id}>{label}:</label>
            <input
                ref={inputRef}
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