export function validateName(value) {
  if (!value.trim()) return "Name is required";
  if (value.length > 30) return "Name must be less than 30 characters";
  return "";
}

export function validateEmail(value) {
  if (!value.trim()) return "Email is required";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return "Invalid email format";
  if (value.length > 50) return "Email must be less than 50 characters";
  return "";
}

export function validatePassword(value) {
  if (!value.trim()) return "Password is required";
  if (value.length < 6) return "Password must be at least 6 characters";
  if (value.length > 20) return "Password must be less than 20 characters";
  return "";
}

export function validateConfirmPassword(value, password) {
  if (!value.trim()) return "Please confirm your password";
  if (value !== password) return "Passwords do not match";
  return "";
}

export function validateLogin(email, password) {
  return (
    validateEmail(email) ||
    validatePassword(password) ||
    null
  );
}

export function validateRegister(name, email, password, confirmPassword) {
  return (
    validateName(name) ||
    validateEmail(email) ||
    validatePassword(password) ||
    validateConfirmPassword(confirmPassword, password) ||
    null
  );
}