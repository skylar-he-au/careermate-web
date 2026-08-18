import { createSlice } from "@reduxjs/toolkit";
import { jobs } from "../data/jobs";

const careerSlice = createSlice({
  name: "career",
  initialState: {
    userId: null,
    applications: [],
  },
  reducers: {
    hydrateCareer(state, action) {
      state.userId = action.payload.userId;
      state.applications = action.payload.applications;
    },
    applicationAdded(state, action) {
      state.applications.unshift(action.payload);
    },
    applicationStatusUpdated(state, action) {
      const application = state.applications.find(
        (candidate) => candidate.id === action.payload.applicationId
      );
      if (application) application.status = action.payload.status;
    },
    applicationRemoved(state, action) {
      state.applications = state.applications.filter(
        (application) => application.id !== action.payload
      );
    },
    resetCareer(state) {
      state.userId = null;
      state.applications = [];
    },
  },
});

export const {
  hydrateCareer,
  applicationAdded,
  applicationStatusUpdated,
  applicationRemoved,
  resetCareer,
} = careerSlice.actions;

export function applyToJob(jobId) {
  return (dispatch, getState) => {
    const { auth, career } = getState();
    if (!auth.user?.id) throw new Error("Sign in before adding an application");

    const job = jobs.find((candidate) => candidate.id === jobId);
    if (!job) throw new Error("This job is no longer available");
    if (career.applications.some((application) => application.jobId === jobId)) {
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

    dispatch(applicationAdded(application));
    return application;
  };
}

export default careerSlice.reducer;
