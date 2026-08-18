function getBaseUrl() {
  return (process.env.REACT_APP_BaseAPI || process.env.REACT_APP_BASE_API || "").replace(/\/$/, "");
}

async function request(path, options) {
  const baseUrl = getBaseUrl();
  if (!baseUrl) return null;

  let response;
  try {
    response = await fetch(`${baseUrl}${path}`, {
      ...options,
      headers: { "Content-Type": "application/json", ...options?.headers },
    });
  } catch {
    throw new Error("Unable to connect to the server");
  }

  let result = null;
  try {
    result = await response.json();
  } catch {
    // The response status still gives a useful fallback error below.
  }

  if (!response.ok || result?.success === false) {
    throw new Error(result?.message || `Request failed (${response.status})`);
  }

  return result;
}

export function hasAuthApi() {
  return Boolean(getBaseUrl());
}

export async function loginWithApi(email, password) {
  const result = await request("/v1/auth/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });

  if (!result) return null;
  const remoteUser = result.data?.user ?? result.user;
  const token = result.data?.accessToken ?? result.accessToken;

  if (!remoteUser?.email) throw new Error("The server returned an invalid login response");

  return {
    id: remoteUser.id ?? remoteUser._id ?? `api-${remoteUser.email}`,
    name: remoteUser.fullName ?? remoteUser.name ?? remoteUser.email,
    email: remoteUser.email,
    title: remoteUser.title ?? "Job seeker",
    location: remoteUser.location ?? "",
    bio: remoteUser.bio ?? "",
    ...(token ? { token } : {}),
  };
}

export async function registerWithApi(name, email, password) {
  const result = await request("/v1/auth/register", {
    method: "POST",
    body: JSON.stringify({ fullName: name, email, password }),
  });

  if (!result) return null;
  return result.data?.user ?? result.user ?? { fullName: name, email };
}
