import axiosInstance from "./axiosInstance";

const getResources = async (orgID) => {
  const response = await axiosInstance.get("/resources/all", {
    params: { orgID },
  });
  return response.data;
};

export default { getResources };
