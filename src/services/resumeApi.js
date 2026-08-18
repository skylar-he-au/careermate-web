import apiClient from "./apiClient";

export async function getMyResumes({ page, pageSize }) {
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
  const response = await apiClient.get(`/v1/resumes/${resumeId}/download`);
  return response.data?.data;
}
