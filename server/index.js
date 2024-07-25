import mongoose from "mongoose";
import express from "express";
import helmet from "helmet";
import * as dotenv from "dotenv";
import userRoutes from "./routes/user/users.js";

dotenv.config();

const app = express();

app.use(express.json());
app.use(helmet());
app.use(helmet.crossOriginResourcePolicy({ policy: "cross-origin" }));

const PORT = process.env.PORT || 5000;
mongoose
    .connect(process.env.MONGO_URI)
    .then(
        app.listen(PORT, () => console.log(`Server running on port: ${PORT}`))
    )
    .catch((err) => console.log(`error: ${err.message}`));

app.use("/users", userRoutes);
