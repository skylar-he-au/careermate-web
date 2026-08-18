import apiClient from "./apiClient";

function normalizeUser(remoteUser) {
  return {
    id: remoteUser.id ?? remoteUser._id,
    name: remoteUser.fullName ?? remoteUser.displayName ?? remoteUser.email,
    email: remoteUser.email,
    title: remoteUser.goal ?? "Job seeker",
    avatarUrl: remoteUser.avatarUrl ?? null,
  };
}

export async function loginWithApi(email, password) {
  const response = await apiClient.post("/v1/auth/login", { email, password });
  const remoteUser = response.data?.data?.user;
  const token = response.data?.data?.token;

  if (!remoteUser?.email || !token) {
    throw new Error("The server returned an invalid login response");
  }

  return { user: normalizeUser(remoteUser), token };
}

export async function registerWithApi(name, email, password) {
  const response = await apiClient.post("/v1/auth/register", {
    fullName: name,
    email,
    password,
  });

  return response.data?.data?.user;
}
