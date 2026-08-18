import { configureStore, createListenerMiddleware, isAnyOf } from "@reduxjs/toolkit";
import authReducer, { clearAuth, loginUser } from "./authSlice";
import careerReducer, {
  applicationAdded,
  applicationRemoved,
  applicationStatusUpdated,
  hydrateCareer,
  resetCareer,
} from "./careerSlice";
import resumeReducer from "./resumeSlice";
import { readApplications, saveApplications } from "../utils/applicationStorage";

export function makeStore(preloadedState) {
  const careerListener = createListenerMiddleware();

  careerListener.startListening({
    actionCreator: loginUser.fulfilled,
    effect: (action, listenerApi) => {
      const userId = action.payload.user.id;
      listenerApi.dispatch(
        hydrateCareer({ userId, applications: readApplications(userId) })
      );
    },
  });

  careerListener.startListening({
    actionCreator: clearAuth,
    effect: (_action, listenerApi) => {
      listenerApi.dispatch(resetCareer());
    },
  });

  careerListener.startListening({
    matcher: isAnyOf(
      applicationAdded,
      applicationStatusUpdated,
      applicationRemoved
    ),
    effect: (_action, listenerApi) => {
      const { auth, career } = listenerApi.getState();
      saveApplications(auth.user?.id, career.applications);
    },
  });

  const store = configureStore({
    reducer: {
      auth: authReducer,
      career: careerReducer,
      resumes: resumeReducer,
    },
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().prepend(careerListener.middleware),
  });

  if (!preloadedState?.career) {
    const userId = store.getState().auth.user?.id ?? null;
    store.dispatch(
      hydrateCareer({ userId, applications: readApplications(userId) })
    );
  }

  return store;
}

const store = makeStore();
export default store;
