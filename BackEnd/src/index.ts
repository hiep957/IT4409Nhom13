import express, { Request, Response } from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import "dotenv/config";
import UserRouter from "./routes/UsersRouter";
import myHotelRoutes from "./routes/my-hotels"
import hotelRoutes from "./routes/hotels";
import bookingRoutes from "./routes/my-bookings";
import mongoose, { ConnectOptions } from "mongoose";
import { v2 as cloudinary } from "cloudinary";
import path from "path";
//Kết nối database
const mongoUri = process.env.MONGO_URL;

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
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

app.use(express.static(path.join(__dirname,"../../Front_end/dist")));

app.use(
  cors({
    origin: (origin, callback) => {
      const allowedOrigins = [process.env.FRONTEND_URL, "https://it4409nhom13.onrender.com", "http://localhost:5173", "http://localhost:5174"];
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    credentials: true,
  })
);

app.use("/user", UserRouter);
app.use("/my-hotels",myHotelRoutes);
app.use("/api/hotels", hotelRoutes);
app.use("/api/my-bookings",bookingRoutes)

app.get("/api/test", async (req: Request, res: Response) => {
  res.send("Hello World");
});
app.get("*", (req: Request, res: Response) => {
  res.sendFile(path.join(__dirname, "../../Front_end/dist/index.html"));
});
app.listen(7000, () => {
  console.log("Server is running on port 7000");
});
