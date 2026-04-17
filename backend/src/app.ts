import "./config/dotenvconfig.js";
import "dotenv/config";
import express, {type Request, type Response} from "express";
import AuthRoutes from "./routes/AuthRoutes.js";
import cors from "cors";
import cookieParser from "cookie-parser";
import {connectDB} from "./config/db.js";
import PetRoutes from "./routes/PetRoutes.js";
import AppointmentRoutes from "./routes/AppointmentRoutes.js";
const app = express();

connectDB();

app.use(express.json());
app.use(
  cors({
    origin: process.env.CLIENT_URL,
    credentials: true, // allow cookies
  }),
);
app.use(cookieParser());

app.get("/", (req: Request, res: Response) => {
  res.send("server is running;");
});

app.use("/api/auth", AuthRoutes);
app.use("/api/pets", PetRoutes);
app.use("/api/appointment", AppointmentRoutes);

export default app;
