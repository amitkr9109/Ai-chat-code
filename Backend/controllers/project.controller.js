import { validationResult } from "express-validator";
import * as ProjectService from "../services/project.service.js";
import UserModel from "../models/user.model.js";

export const createProjectController = async (req, res) => {

    const errors = validationResult(req);

    if(!errors){
        return res.status(400).json({ errors: errors.array() });
    }

    try {

        const { name } = req.body;
        const loggedInUser = await UserModel.findOne({ email: req.user.email });
        const userId = loggedInUser._id;

        const newProject = await ProjectService.createProject({ name, userId });
        res.status(201).json(newProject);

    } catch (error) {
        res.status(400).send(error.message);
    }

};

export const getAllProjectController = async (req, res) => {

    try {
        
        const loggedInUser = await UserModel.findOne({ email: req.user.email });

        const allUserProjects = await ProjectService.getAllProjectByUserId({ userId: loggedInUser._id });
        return res.status(200).json({ projects: allUserProjects });

    } catch (error) {
        res.status(400).json({error: error.message});
    }
};

export const addUserToProjectController = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        
        const { projectId, users } = req.body;

        const loggedInUser = await UserModel.findOne({ email: req.user.email });

        const project = await ProjectService.addUsersToProject({
            projectId,
            users,
            userId: loggedInUser._id
        });

        return res.status(200).json({project});

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};


export const getProjectController = async (req, res) => {
    
    try {

       const {id} = req.params; 
       
       const project = await ProjectService.readProject(id);
       if(!project) {
        return res.status(400).json({ errors: "ProjectId is required" });
       }

       res.status(200).json({ message: "Project fetched successfully", projectData: project });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};


export const updateProjectController = async (req, res) => {

    try {

        const {id} = req.params;

        const project = await ProjectService.updateProject(id, req.body);
        if(!project){
            return res.status(400).json({ message: "ProjectId not found" });
        }

        res.status(200).json({ message: "Project updated successfully", updateData: project });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

}


export const deleteProjectController = async (req, res) => {

    try {

       const {id} = req.params; 
       
       const project = await ProjectService.deleteProject(id);
       if(!project) {
        return res.status(400).json({ errors: "ProjectId is required" });
       }

       res.status(200).json({ message: "Project deleted successfully", projectDeleteData: project });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }
};



export const getProjectByIdController = async (req, res) => {

    const { id } = req. params;

    try {
        
        const project = await ProjectService.getProjectById({id});
        return res.status(200).json({ project });

    } catch (error) {
        res.status(400).json({ error: error.message });
    }

};

