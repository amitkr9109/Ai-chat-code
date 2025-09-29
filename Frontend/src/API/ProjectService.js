import { toast } from "react-toastify";
import axios from "../config/axios";


export const createProjectService = async (data) => {
  try {
    const res = await axios.post("/projects/create", data);
    return res?.data?.project;
  } catch (error) {
     if (error.response && error.response.data) {
      if (Array.isArray(error.response.data.errors)) {
        error.response.data.errors.forEach(err => toast.error(err.msg));
        throw error.response.data.errors.map(err => err.msg).join(", ");
      }
      else if (typeof error.response.data === "string") {
        toast.error(error.response.data);
        throw error.response.data;
      }
      else if (error.response.data.message) {
        toast.error(error.response.data.message);
        throw error.response.data.message;
      }
    } else {
      toast.error("Server not responding");
    }
  }
};

export const allFetchedProjectService = async () => {
  try {
    const res = await axios.get("/projects/all-read");
    return res?.data?.projects || [];
  } catch(error) {
    console.log(error);
    return [];
  };
};


export const updateProjectService = async (id, updateData) => {
  try {
    const res = await axios.put(`/projects/update/${id}`, updateData);
    return res?.data?.updatedProject;
  } catch (error) {
    console.error(error);
    throw error.response?.data?.error || "Failed to update project";
  }
};

export const deleteProjectService = async (id) => {
  try {
    const res = await axios.delete(`/projects/delete/${id}`);
    return res?.data?.message;
  } catch (error) {
    console.log(error);
    res.send(error.response.data.message);
  }
};