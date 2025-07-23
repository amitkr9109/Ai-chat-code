import express from "express";
import morgan from "morgan";
import ConnectTODB from "./db/db.js";
import UserRoutes from "./routes/user.routes.js";
import ProjectRoutes from "./routes/project.routes.js";
import AiRoutes from "./routes/ai.routes.js";
import cookieParser from "cookie-parser";
import cors from "cors";


ConnectTODB();


const app = express();

app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get("/", (req, res) => {
    res.send("hello server !");
});

app.use("/users", UserRoutes);
app.use("/projects", ProjectRoutes);
app.use("/ai", AiRoutes);

export default app;