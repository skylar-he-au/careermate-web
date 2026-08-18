import apiClient from "./apiClient";
import { mockResumes } from "../data/mockResumes";

const useMockResumes =
  process.env.NODE_ENV === "development" &&
  process.env.REACT_APP_USE_MOCK_RESUMES === "true";

export async function getMyResumes({ page, pageSize }) {
  if (useMockResumes) {
    const start = (page - 1) * pageSize;
    return {
      items: mockResumes.slice(start, start + pageSize),
      pagination: {
        page,
        pageSize,
        totalItems: mockResumes.length,
        totalPages: Math.max(1, Math.ceil(mockResumes.length / pageSize)),
      },
    };
  }

  const response = await apiClient.get("/v1/resumes", {
    params: { page, limit: pageSize },
  });

  const pagination = response.data?.pagination ?? {};
  const totalItems = Number(pagination.total ?? 0);
  const resolvedPageSize = Number(pagination.limit ?? pageSize);

  return {
    items: response.data?.data ?? [],
    pagination: {
      page: Number(pagination.page ?? page),
      pageSize: resolvedPageSize,
      totalItems,
      totalPages: Math.max(1, Math.ceil(totalItems / resolvedPageSize)),
    },
  };
}

export async function getResumeDownload(resumeId) {
  if (resumeId.startsWith("mock-resume-")) {
    throw new Error("Sample resumes are for pagination preview only");
  }

  const response = await apiClient.get(`/v1/resumes/${resumeId}/download`);
  return response.data?.data;
}
