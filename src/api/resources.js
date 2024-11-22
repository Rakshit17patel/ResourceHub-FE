import axiosInstance from "./axiosInstance";

const getResources = async (orgID) => {
  const response = await axiosInstance.get("/resources/all", {
    params: { orgID },
  });
  return response.data;
};

const postResource = async (orgID, resourceData) => {
  try {
    console.log(JSON.stringify(resourceData))
    const response = await axiosInstance.post("/resources/",resourceData, {
      params: { orgID },
    });
    return response.data;
  } catch (error) {
    console.error("Error posting resource:", error);
    throw error; 
  }
};


export default { getResources,postResource };
