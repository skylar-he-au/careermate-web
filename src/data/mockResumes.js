const fileNames = [
  "Software-Engineer-Resume.pdf",
  "Frontend-Developer-CV.pdf",
  "React-Developer-Resume.pdf",
  "Full-Stack-Resume.pdf",
  "Graduate-Developer-CV.pdf",
  "Product-Engineer-Resume.pdf",
  "Web-Developer-CV.pdf",
  "JavaScript-Engineer-Resume.pdf",
  "Application-Developer-CV.pdf",
  "CareerMate-General-Resume.pdf",
];

export const mockResumes = fileNames.map((fileName, index) => ({
  _id: `mock-resume-${index + 1}`,
  fileName,
  fileSize: 180000 + index * 37425,
  createdAt: new Date(Date.UTC(2026, 7, 18 - index)).toISOString(),
  isSample: true,
}));
