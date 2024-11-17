// src/api/projects.js

import axiosInstance from "./axiosInstance";

const getProjects = async (orgId) => {
  const response = await axiosInstance.get("/projects", {
    params: { orgId },
  });
  return response.data;
};

export default { getProjects };
