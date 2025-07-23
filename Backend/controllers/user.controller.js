import UserModel from "../models/user.model.js";
import * as UserService from "../services/user.service.js";
import { validationResult } from "express-validator";
import redisClient from "../services/redis.service.js";

export const createUserController = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({ errors: errors.array() });
    }

    try {
        const user = await UserService.createUser(req.body);
        const token = await user.generateJWT();
        delete user._doc.password;
        res.status(201).json({ user, token });
        
    } catch (error) {
        res.status(400).send(error.message);
    }

};

export const loginUserController = async (req, res) => {

    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(401).json({ errors: errors.array() });
    }
    
    try {
      const { email, password } = req.body;  

      const user = await UserModel.findOne({ email }).select("+password");
      if(!user){
        return res.status(401).json({ errors: "Invalid credentials" });
      }

      const isMatch = await user.comparePassword(password);
      if(!isMatch){
        return res.status(401).json({ errors: "Password not matched" });
      }

      const token = await user.generateJWT();
      delete user._doc.password;
      res.status(200).json({ user, token });

    } catch (error) {
        res.status(400).send(error.message);
    }

};

export const profileUserController = async (req, res) => {
    res.status(200).json({ user: req.user })
};

export const logOutController = async (req, res) => {
    try {

        const token = req.cookies.token || req.headers.authorization.split(' ')[1];

        redisClient.set(token, 'logout', 'EX', 60 * 60 * 24);
        res.status(200).json({ message: "Logged out successfully" });

    } catch (error) {
        res.status(400).send(error.message);
    }
};


export const getALLUsersController = async (req, res) => {
    try {

        const loggedInUser = await UserModel.findOne({
            email: req.user.email
        })
        
        const allusers = await UserService.allreadUsers({ userId: loggedInUser._id });

        return res.status(200).json({ users: allusers });

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};

export const getUserController = async (req, res) => {

    try {

        const {id} = req.params;

        const user = await UserService.readUser(id);
   
        if(!user){
            return res.status(401).json({ errors: "UserId Incorrect" });
        }

        res.status(200).json({ message: "UserView Fetched successfully", viewdata: user });

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};


export const updateUserController = async (req, res) => {
    try {
        
        const {id} = req.params;

        const user = await UserService.updateUser(id, req.body);

        if(!user) {
            return res.status(401).json({ errors: "UserId not found" });
        }

        res.status(200).json({ message: "User Updated successfully", updateData: user });

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};

export const deleteUserController = async (req, res) => {

    try {

        const {id} = req.params;

        const user = await UserService.deleteUser(id);
   
        if(!user){
            return res.status(401).json({ errors: "UserId Incorrect" });
        }

        res.status(200).json({ message: "User deleted successfully", deletedata: user });

    } catch (error) {
        console.log(error);
        res.status(400).send(error.message);
    }
};