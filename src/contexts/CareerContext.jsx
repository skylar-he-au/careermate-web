import { createContext, useContext, useMemo, useState } from "react";
import { jobs } from "../data/jobs";
import { useAuth } from "./AuthContext";

const CareerContext = createContext(null);

function getStorageKey(userId) {
  return `careermate.applications.${userId}`;
}

function readApplications(userId) {
  if (!userId) return [];

  try {
    return JSON.parse(localStorage.getItem(getStorageKey(userId))) ?? [];
  } catch {
    localStorage.removeItem(getStorageKey(userId));
    return [];
  }
}

export function CareerProvider({ children }) {
  const { user } = useAuth();
  const [state, setState] = useState(() => ({
    userId: user?.id ?? null,
    applications: readApplications(user?.id),
  }));

  const userId = user?.id ?? null;
  const applications =
    state.userId === userId ? state.applications : readApplications(userId);

  function persist(nextApplications) {
    if (!userId) return;
    localStorage.setItem(getStorageKey(userId), JSON.stringify(nextApplications));
    setState({ userId, applications: nextApplications });
  }

  function applyToJob(jobId) {
    const job = jobs.find((candidate) => candidate.id === jobId);
    if (!job) throw new Error("This job is no longer available");
    if (applications.some((application) => application.jobId === jobId)) {
      throw new Error("You have already added this job to your tracker");
    }

    const application = {
      id: `application-${Date.now()}`,
      jobId,
      jobTitle: job.title,
      company: job.company,
      location: job.location,
      status: "Applied",
      appliedAt: new Date().toISOString(),
    };

    persist([application, ...applications]);
    return application;
  }

  function updateApplicationStatus(applicationId, status) {
    persist(
      applications.map((application) =>
        application.id === applicationId ? { ...application, status } : application
      )
    );
  }

  function removeApplication(applicationId) {
    persist(applications.filter((application) => application.id !== applicationId));
  }

  const value = useMemo(
    () => ({
      jobs,
      applications,
      applyToJob,
      updateApplicationStatus,
      removeApplication,
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [applications, userId]
  );

  return <CareerContext.Provider value={value}>{children}</CareerContext.Provider>;
}

export function useCareer() {
  const context = useContext(CareerContext);

  if (!context) {
    throw new Error("useCareer must be used inside CareerProvider");
  }

  return context;
}
