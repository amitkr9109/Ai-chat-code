import { Router } from "express";
import * as UserController from "../controllers/user.controller.js";
import { body } from "express-validator";
import { authUser } from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register",
    body("email").isEmail().withMessage("Email must be a valid email address"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
    UserController.createUserController);

router.post("/login",
    body("email").isEmail().withMessage("Email must be a valid email address"),
    body("password").isLength({ min: 3 }).withMessage("Password must be at least 3 characters long"),
    UserController.loginUserController);

router.get("/profile", authUser, UserController.profileUserController);

router.get("/logout", authUser, UserController.logOutController);

router.get("/all-read", authUser, UserController.getALLUsersController);

router.get("/read/:id", UserController.getUserController);

router.put("/update/:id", authUser, UserController.updateUserController);

router.delete("/delete/:id", UserController.deleteUserController);



export default router;