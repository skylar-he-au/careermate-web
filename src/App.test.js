import { fireEvent, render, screen, waitFor } from "@testing-library/react";
import { Provider } from "react-redux";
import App from "./App";
import TextInput from "./components/TextInput";
import { CareerProvider } from "./contexts/CareerContext";
import { loginWithApi } from "./services/authApi";
import { getMyResumes } from "./services/resumeApi";
import { makeStore } from "./store/store";

jest.mock("./services/authApi", () => ({
  loginWithApi: jest.fn(),
  registerWithApi: jest.fn(),
}));

jest.mock("./services/resumeApi", () => ({
  getMyResumes: jest.fn(),
  getResumeDownload: jest.fn(),
}));

function renderApp(preloadedState) {
  const store = makeStore(preloadedState);
  return {
    store,
    ...render(
      <Provider store={store}>
        <CareerProvider>
          <App />
        </CareerProvider>
      </Provider>
    ),
  };
}

function authenticatedState() {
  return {
    auth: {
      user: { id: "user-1", name: "Alex", email: "alex@example.com" },
      token: "jwt-token",
      status: "idle",
      error: null,
    },
    resumes: {
      items: [],
      pagination: { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 },
      status: "idle",
      error: null,
    },
  };
}

beforeEach(() => {
  localStorage.clear();
  jest.clearAllMocks();
});

test("redirects signed-out visitors to the login page", async () => {
  window.history.pushState({}, "", "/home");
  renderApp();

  expect(await screen.findByRole("heading", { name: /sign in to your account/i })).toBeInTheDocument();
});

test("signs in through the API and saves the authenticated session", async () => {
  loginWithApi.mockResolvedValue({
    user: { id: "user-1", name: "Alex", email: "alex@example.com" },
    token: "jwt-token",
  });
  window.history.pushState({}, "", "/login");
  renderApp();

  fireEvent.change(screen.getByLabelText(/email address/i), { target: { value: "alex@example.com" } });
  fireEvent.change(screen.getByLabelText(/^password/i), { target: { value: "123456" } });
  fireEvent.click(screen.getByRole("button", { name: /^sign in$/i }));

  expect(await screen.findByRole("heading", { name: /welcome back, alex/i })).toBeInTheDocument();
  expect(loginWithApi).toHaveBeenCalledWith("alex@example.com", "123456");
  expect(JSON.parse(localStorage.getItem("careermate.auth"))).toMatchObject({ token: "jwt-token" });
});

test("adds a job to the signed-in user's application tracker", async () => {
  window.history.pushState({}, "", "/jobs");
  renderApp(authenticatedState());

  const addButtons = await screen.findAllByRole("button", { name: /add to tracker/i });
  fireEvent.click(addButtons[0]);

  expect(await screen.findByText(/was added to your tracker/i)).toBeInTheDocument();
  expect(JSON.parse(localStorage.getItem("careermate.applications.user-1"))).toHaveLength(1);
});

test("loads only the signed-in user's paginated resumes", async () => {
  getMyResumes.mockResolvedValue({
    items: [{ _id: "resume-1", fileName: "Alex-CV.pdf", fileSize: 2048, createdAt: "2026-08-18T00:00:00.000Z" }],
    pagination: { page: 1, pageSize: 10, totalItems: 1, totalPages: 1 },
  });
  window.history.pushState({}, "", "/resumes");
  renderApp(authenticatedState());

  expect(await screen.findByText("Alex-CV.pdf")).toBeInTheDocument();
  expect(getMyResumes).toHaveBeenCalledWith({ page: 1, pageSize: 10 });
  expect(screen.getByText("1 resume")).toBeInTheDocument();

  fireEvent.change(screen.getByRole("combobox", { name: /rows per page/i }), { target: { value: "20" } });
  await waitFor(() => expect(getMyResumes).toHaveBeenLastCalledWith({ page: 1, pageSize: 20 }));
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
