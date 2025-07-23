import { Router } from "express";
import * as ProjectController from "../controllers/project.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";


const router = Router();

router.post("/create", authUser,
    body("name").isString().withMessage("Name is required"),
    ProjectController.createProjectController);

router.get("/all-read", authUser, ProjectController.getAllProjectController);

router.put("/add-user", authUser, 
    body("projectId").isString().withMessage("ProjectId is required"),
    body('users').isArray({ min: 1 }).withMessage('Users must be an array of strings').bail()
        .custom((users) => users.every(user => typeof user === 'string')).withMessage('Each user must be a string'),
    ProjectController.addUserToProjectController);


router.get("/read/:id", ProjectController.getProjectController);

router.put("/update/:id", authUser, ProjectController.updateProjectController);

router.delete("/delete/:id", ProjectController.deleteProjectController);

router.get("/all-read-project-user/:id", authUser, ProjectController.getProjectByIdController);


    
export default router;