import { fireEvent, render, screen } from "@testing-library/react";
import App from "./App";
import TextInput from "./components/TextInput";
import { AuthProvider } from "./contexts/AuthContext";
import { CareerProvider } from "./contexts/CareerContext";

beforeEach(() => localStorage.clear());

test("redirects signed-out visitors to the login page", async () => {
  window.history.pushState({}, "", "/home");

  render(
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  );

  expect(await screen.findByRole("heading", { name: /sign in to your account/i })).toBeInTheDocument();
});

test("signs in with the demo account", async () => {
  window.history.pushState({}, "", "/login");

  render(
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  );

  fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

  expect(await screen.findByRole("heading", { name: /welcome back, demo/i })).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("careermate.session"))).toMatchObject({ email: "test@test.com" });
});

test("adds a job to the signed-in user's application tracker", async () => {
  localStorage.setItem("careermate.session", JSON.stringify({ id: "test-user", name: "Alex", email: "alex@example.com" }));
  window.history.pushState({}, "", "/jobs");

  render(
    <AuthProvider>
      <CareerProvider>
        <App />
      </CareerProvider>
    </AuthProvider>
  );

  const addButtons = await screen.findAllByRole("button", { name: /add to tracker/i });
  fireEvent.click(addButtons[0]);

  expect(await screen.findByText(/was added to your tracker/i)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("careermate.applications.test-user"))).toHaveLength(1);
});

test("renders an accessible field and reports validation errors", () => {
  const handleChange = jest.fn();

  render(
    <TextInput
      label="Email address"
      name="email"
      type="email"
      value="bad-email"
      onChange={handleChange}
      error="Invalid email format"
    />
  );

  const input = screen.getByRole("textbox", { name: /email address/i });
  expect(input).toHaveAttribute("aria-invalid", "true");
  expect(screen.getByText("Invalid email format")).toBeInTheDocument();

  fireEvent.change(input, { target: { value: "person@example.com" } });
  expect(handleChange).toHaveBeenCalledTimes(1);
});
