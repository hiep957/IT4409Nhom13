import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../middleware/auth";
import User from "../models/UsersModel";
import { check, validationResult } from "express-validator";
// import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { BadRequestError } from "../utils/ApiError";
const router = express.Router();

router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", " Last Name is requires").isString(),
    check("email", "Email is requires").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
    check("role", "Role is required").isString(),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      throw new BadRequestError(
        error
          .array()
          .map((error) => error.msg)
          .join(", ")
      );
    }

    let user = await User.findOne({ email: req.body.email });
    if (user) {
      throw new BadRequestError("User already exists");
    }
    const hashedPassword = await bcrypt.hash(req.body.password, 10);

    user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: hashedPassword,
      role: req.body.role,
    });
    await user.save();

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "2h" }
    );

    res.cookie("Auth_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    return res.status(200).send({ message: "User registered successfully" });
  })
);
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      // return res.status(400).json({ message: error.array() });
      throw new BadRequestError(
        error
          .array()
          .map((error) => error.msg)
          .join(", ")
      );
    }

    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new BadRequestError("Password mismatch");
    }

    const token = jwt.sign(
      { userId: user.id },
      process.env.JWT_SECRET_KEY as string,
      { expiresIn: "2h" }
    );

    res.cookie("Auth_Token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 86400000,
    });

    res.status(200).json({ userId: user._id, token: token });
  })
);
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("Auth_Token", "", {
    expires: new Date(0),
  });
  res.send();
});

router.get(
  "/view_user",
  Auth,
  asyncHandler(async (req: Request, res: Response) => {
    const ViewUser = await User.findById(req.userId).select("-password");
    if (!ViewUser) {
      throw new BadRequestError("User not found");
    }
    res.json(ViewUser);
  })
);
router.get("/validate-token", Auth, (req: Request, res: Response) => {
  try {
    console.log("checkvalidate");
    res.status(200).send({ userId: req.userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put(
  "/edit-info",
  Auth,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, phone, gender, hometown, date } =
      req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      throw new BadRequestError("User not found");
    }

    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.email = email || user.email;
    user.phone = phone || user.phone;
    user.gender = gender || user.gender;
    user.hometown = hometown || user.hometown;
    user.date = date || user.date;
    await user.save();
    res.status(200).json({ msg: "User infor updated successfully." });
  })
);
export default router;
