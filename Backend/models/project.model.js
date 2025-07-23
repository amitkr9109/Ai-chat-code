import mongoose, { model } from "mongoose";

const ProjectSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        lowercase: true,
        trim: true,
        unique: true,
    },

    users: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        }
    ],
});

const projectModel = mongoose.model("Project", ProjectSchema);
export default projectModel;