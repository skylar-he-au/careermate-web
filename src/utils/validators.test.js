import {
  validateConfirmPassword,
  validateEmail,
  validateLogin,
  validateName,
  validatePassword,
  validateRegister,
} from "./validators";

describe("form validators", () => {
  test("accepts valid account details", () => {
    expect(validateName("Alex Smith")).toBe("");
    expect(validateEmail("alex@example.com")).toBe("");
    expect(validatePassword("strong123")).toBe("");
    expect(validateConfirmPassword("strong123", "strong123")).toBe("");
    expect(validateRegister("Alex Smith", "alex@example.com", "strong123", "strong123")).toBeNull();
  });

  test("returns the first useful validation error", () => {
    expect(validateLogin("invalid", "123456")).toBe("Invalid email format");
    expect(validateRegister("", "alex@example.com", "strong123", "strong123")).toBe("Name is required");
    expect(validateConfirmPassword("different", "strong123")).toBe("Passwords do not match");
  });
});
