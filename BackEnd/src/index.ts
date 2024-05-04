import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import UserRouter from "./routes/UsersRouter";
import mongoose, { ConnectOptions } from "mongoose";

//Kết nối database
const mongoUri = process.env.MONGO_URL;

if (!mongoUri) {
  throw new Error("Please define the MONGO_URI environment variable");
}

mongoose
  .connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  } as ConnectOptions)
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.error("MongoDB connection failed:", error);
  });

const app = express();
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const corsOptions: cors.CorsOptions = {
  origin: "http://localhost:5173",
  credentials: true,
};

app.use(cors(corsOptions));

app.use("/user", UserRouter);
app.get("/api/test", async (req: Request, res: Response) => {
  res.send("Hello World");
});

app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
