import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./authSlice";
import resumeReducer from "./resumeSlice";

export function makeStore(preloadedState) {
  return configureStore({
    reducer: {
      auth: authReducer,
      resumes: resumeReducer,
    },
    preloadedState,
  });
}

const store = makeStore();
export default store;
