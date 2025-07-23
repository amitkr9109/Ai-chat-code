import mongoose from "mongoose";

function ConnectTODB(){
    mongoose.connect(process.env.MONGODB_URI)
    .then(() => {
        console.log("Connected to MongoDB")
    }).catch(err => {
        console.log("Error in database connection", err)
    })
};

export default ConnectTODB;