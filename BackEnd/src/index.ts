import express, { Request, Response } from "express";
import cors from "cors";
import "dotenv/config";
import mongoose from "mongoose";

//Kết nối database
mongoose.connect(process.env.MONGO_URL as string);

const app = express();
// app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

app.get("/api/test", async (req: Request, res: Response) => {
    res.send("Hello World");  
})

app.listen(7000, ()=>{
    console.log("Server is running on port 7000");
})