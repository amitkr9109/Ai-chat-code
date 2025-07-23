import UserModel from "../models/user.model.js";

export const createUser = async ({ email, password }) => {
    if(!email || !password){
        throw new Error("Email and Password is required");
    }

    const hashedPassword = await UserModel.hashPassword(password);

    const user = await UserModel.create({
        email,
        password: hashedPassword
    });
    return user;
};

export const allreadUsers = async({ userId }) => {

    const users = await UserModel.find({
        _id: { $ne: userId }
    });
    return users;

};


export const readUser = async (id) => {

    const user = await UserModel.findById(id);
    return user;
};

export const updateUser = async (id, updateData) => {

    if (!id) {
        throw new Error("User ID is required");
    }

    if (updateData.password) {
        updateData.password = await UserModel.hashPassword(updateData.password);
    }

    const user = await UserModel.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
    return user;
};

export const deleteUser = async (id) => {
    
    const user = await UserModel.findByIdAndDelete(id);
    return user;

};