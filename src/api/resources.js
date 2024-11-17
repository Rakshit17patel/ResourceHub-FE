import axiosInstance from "./axiosInstance";

const getResources = async (orgId) => {
  const response = await axiosInstance.get("/resources", {
    params: { orgId },
  });
  return response.data;
};

export default { getResources };
