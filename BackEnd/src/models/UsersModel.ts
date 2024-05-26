import mongoose from "mongoose";
import { UserType } from "../shared/types";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    password: {
        type: String,
        required: true,
    },
    firstName: {
        type: String,
        required: true,
    },
    lastName: {
        type: String,
        required: true,
    },
    gender: {
        type: String,
        enum: ['Nam', 'Nữ', "Khác", " "],
        default: " ",
    
    },
    phone: {
        type: Number,
        default: ' '
        
    },
    date: {
        type: Date,
        default: "01/01/2001"
    },
    hometown: {
        type:String,
        default: " "
    }
    


},{
    timestamps: true
});

export default mongoose.model<UserType> ('User', userSchema);