import mongoose from "mongoose";
import ProjectModel from "../models/project.model.js";

export const createProject = async ({name, userId}) => {
    if(!name){
        throw new Error("Name is required");
    }
    if(!userId){
        throw new Error("UserId is required");
    }

    let project;
    try {
        project = await ProjectModel.create({
            name, users: [userId]
        })
    } catch (error) {
        if(error.code === 11000){
            throw new Error("Project name is already exists")
        }
    }
    return project;
};

export const getAllProjectByUserId = async ({ userId }) => {

    if(!userId){
        throw new Error("UserId is required");
    }

    const allUserProjects = await ProjectModel.find({ users: userId });
    return allUserProjects;
 
};

export const addUsersToProject = async ({ projectId, users, userId }) => {

    if(!projectId) {
        throw new Error("ProjectId is required");
    }

    if(!mongoose.Types.ObjectId.isValid(projectId)) {
        throw new Error("Invalid ProjectId");
    }

    if(!users) {
        throw new Error("Users are required");
    }

    if(!Array.isArray(users) || users.some(userId => !mongoose.Types.ObjectId.isValid(userId))) {
        throw new Error("Invalid UserId(s) in users array");
    }

    if(!userId) {
        throw new Error("UserId is required");
    }

    if (!mongoose.Types.ObjectId.isValid(userId)) {
        throw new Error("Invalid userId");
    }

    const project = await ProjectModel.findOne({
        _id: projectId,
        users: userId
    });

    if(!project) {
        throw new Error("User not belong to this project");
    }
    
    const updatedProject = await ProjectModel.findOneAndUpdate({
        _id: projectId,
    }, {
        $addToSet: {
            users: {
                $each: users
            }
        }
    }, {
        new: true
    }

    )

    return updatedProject;
};


export const readProject = async (id) => {

    const project = await ProjectModel.findById(id);
    return project;

};

export const updateProject = async (id, updateData) => {

    if (!id) {
        throw new Error("Project ID is required");
    };

    const project = await ProjectModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return project;
    
};

export const deleteProject = async (id) => {

    const project = await ProjectModel.findByIdAndDelete(id);
    return project;
    
};

export const getProjectById = async ({id}) => {

    if(!id){
        throw new Error("ProjectId is required");
    };

    if(!mongoose.Types.ObjectId.isValid(id)) {
        throw new Error("Invalid ProjectId");
    };

    const project = await ProjectModel.findOne({ _id: id }).populate("users");
    return project;

};
