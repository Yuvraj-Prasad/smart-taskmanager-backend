import express from 'express';
import cors from 'cors';
import connectDB from './config/db.js';
import userRoutes from './routes/userRoutes.js';
import dotenv from 'dotenv';
import protect from './middleware/authMiddleware.js';
import taskRoutes from './routes/taskRoutes.js'

dotenv.config();
connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

app.get("/api/user/protected", protect, (req, res) =>{
    res.json({
        message: "You are authorized",
        user: req.user
    })
});
app.get("/", (req, res) =>{
    res.json({
        mssg: "Task Manager API is running"
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>{
    console.log(`Server is running on th PORT ${PORT}`);
});