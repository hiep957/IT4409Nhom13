import mongoose from "mongoose";
import { UserType } from "../shared/types";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
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
    fullName: {
      type: String,
      default: "1 ",
    },
    gender: {
      type: String,
      default: " ",
    },
    phone: {
      type: String,
      default: " ",
    },
    date: {
      type: Date,
      default: "01/01/2001",
    },
    hometown: {
      type: String,
      default: " ",
    },
    role: {
      type: String,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index(
  { fullName: "text" },
  {
    default_language: "vi",
    language_override: "vi",
    collation: {
      locale: "vi",
      alternate: "shifted",
      caseLevel: false,
      numericOrdering: false,
      strength: 2,
    },
  }
);

export default mongoose.model<UserType>("User", userSchema);
