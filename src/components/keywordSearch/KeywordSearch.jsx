import { useEffect, useId, useRef } from "react";
import useDebounce from "../../hooks/useDebounce";
import "./KeywordSearch.css";

export default function KeywordSearch({
  value,
  onChange,
  onSearch,
  placeholder = "Search by keyword",
  debounceDelay = 400,
  label = "Search",
}) {
  const inputId = useId();
  const debouncedKeyword = useDebounce(value, debounceDelay);
  const onSearchRef = useRef(onSearch);

  useEffect(() => {
    onSearchRef.current = onSearch;
  }, [onSearch]);

  useEffect(() => {
    onSearchRef.current?.(debouncedKeyword.trim());
  }, [debouncedKeyword]);

  return (
    <div className="keyword-search">
      <label className="keyword-search-label" htmlFor={inputId}>{label}</label>
      <span className="keyword-search-control">
        <span className="keyword-search-icon" aria-hidden="true">⌕</span>
        <input
          id={inputId}
          type="search"
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder={placeholder}
          autoComplete="off"
        />
        {value && (
          <button
            type="button"
            className="keyword-search-clear"
            onClick={() => onChange("")}
            aria-label="Clear search"
          >
            ×
          </button>
        )}
      </span>
    </div>
  );
}
