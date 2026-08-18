function getStorageKey(userId) {
  return `careermate.applications.${userId}`;
}

export function readApplications(userId) {
  if (!userId) return [];

  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId))) ?? [];
  } catch {
    localStorage.removeItem(getStorageKey(userId));
    return [];
  }
}

export function saveApplications(userId, applications) {
  if (!userId) return;
  localStorage.setItem(getStorageKey(userId), JSON.stringify(applications));
}
