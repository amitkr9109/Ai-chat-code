import axios from "../config/axios";


export const createProjectService = async (data) => {
  try {
    const res = await axios.post("/projects/create", data);
    return res.data.project;
  } catch (error) {
    console.error(error);
    throw error.response?.data?.error || "Failed to create project";
  }
};

export const allFetchedProjectService = async () => {
  try {
    const res = await axios.get("/projects/all-read");
    return res.data.projects;
  } catch(error) {
    console.log(error);
  };
};


export const updateProjectService = async (id, updateData) => {
  try {
    const res = await axios.put(`/projects/update/${id}`, updateData);
    return res.data.updatedProject;
  } catch (error) {
    console.error(error);
    throw error.response?.data?.error || "Failed to update project";
  }
};

export const deleteProjectService = async (id) => {
  try {
    const res = await axios.delete(`/projects/delete/${id}`);
    return res.data.message;
  } catch (error) {
    console.log(error);
    res.send(error.response.data.message);
  }
};