import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import { getMyResumes } from "../services/resumeApi";

export const fetchResumes = createAsyncThunk(
  "resumes/fetch",
  async ({ page, pageSize }, { rejectWithValue }) => {
    try {
      return await getMyResumes({ page, pageSize });
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

const resumeSlice = createSlice({
  name: "resumes",
  initialState: {
    items: [],
    pagination: {
      page: 1,
      pageSize: 10,
      totalItems: 0,
      totalPages: 1,
    },
    status: "idle",
    error: null,
  },
  reducers: {
    setPage(state, action) {
      state.pagination.page = action.payload;
    },
    setPageSize(state, action) {
      state.pagination.pageSize = action.payload;
      state.pagination.page = 1;
    },
    resetResumes(state) {
      state.items = [];
      state.pagination = { page: 1, pageSize: 10, totalItems: 0, totalPages: 1 };
      state.status = "idle";
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchResumes.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(fetchResumes.fulfilled, (state, action) => {
        state.status = "succeeded";
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchResumes.rejected, (state, action) => {
        state.status = "failed";
        state.error = action.payload || "Unable to load resumes";
      });
  },
});

export const { setPage, setPageSize, resetResumes } = resumeSlice.actions;
export default resumeSlice.reducer;
