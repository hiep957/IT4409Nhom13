import express, { NextFunction, Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { verifyToken, verifyTokenAndAdmin } from "../middleware/auth";
import User from "../models/UsersModel";
import { check, validationResult } from "express-validator";
// import ApiError from "../utils/ApiError";
import asyncHandler from "../utils/asyncHandler";
import { BadRequestError } from "../utils/ApiError";
import Redis from "ioredis";
import removeDiacritics from 'diacritics';
import { create } from "domain";
const redis = new Redis();
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

    const { password, ...userObj } = user.toObject();

    //Chèn thêm thông tin người dùng vào redis theo key value
    await redis.set(
      `${user._id}`,
      JSON.stringify(userObj),
      "EX",
      3600 * 24 * 3
    );
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
      { userId: user.id, role: user.role },
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
  "/view_user/:id",
  verifyToken,
  asyncHandler(async (req: Request, res: Response) => {
    //lấy data từ redis nếu không có thì lấy từ database rồi lại set vào redis
    let userData = await redis.get(`${req.params.id}`);

    if (!userData) {
      const ViewUser = await User.findById(req.params.id).select("-password");
      if (!ViewUser) {
        await redis.set(`${req.params.id}`, "not_found", "EX", 3600 * 24 * 3);
        throw new BadRequestError("User not found");
      }
      await redis.set(
        `${req.params.id}`,
        JSON.stringify(ViewUser),
        "EX",
        3600 * 24 * 3
      );
      userData = JSON.stringify(ViewUser);
    }
    const parsedUserData: any = JSON.parse(userData);
    if (parsedUserData.isDeleted) throw new BadRequestError("User not found");
    res.json(parsedUserData);
  })
);

router.post(
  "/users",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response) => {
    // Check if list of users is cached

    const page = parseInt(req.body.page as string) || 1;
    const limit = parseInt(req.body.limit as string) || 6;
    const skip = (page - 1) * limit;

    let query = {};
    // let sortOption = req.body.sortOption;
    let sort: { [key: string]: any } = { createdAt: req.body.sortOption };
    //Tìm kiếm theo tên
    // Nếu có req.body.name, tạo điều kiện tìm kiếm firstName hoặc lastName
    if (req.body.name) {
      // const name = req.body.name as string;
      const name = removeDiacritics.remove(req.body.name).toLowerCase();
      query = {
        $text: { $search: name }, // Sử dụng regex để tìm kiếm không phân biệt hoa thường
      }
      sort = { score: { $meta: "textScore" } };
      
    }

    const users = await User.find(query)
      .select("-password")
      .select({ score: { $meta: "textScore" } })
      .sort(sort)
      .skip(skip)
      .limit(limit);
    res.status(200).json({
      message: "Lấy dữ liệu thành công",
      page: page,
      limit: limit,
      user: users,
    });
  })
);
router.get("/validate-token", verifyToken, (req: Request, res: Response) => {
  try {
    console.log("checkvalidate");
    res.status(200).send({ userId: req.userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put(
  "/edit-info/:id",
  verifyToken,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { firstName, lastName, email, phone, gender, hometown, date,fullName } =
      req.body;

    const updateFiled: any = {};

    if (firstName !== undefined) updateFiled.firstName = firstName;
    if (lastName !== undefined) updateFiled.lastName = lastName;
    if (email !== undefined) updateFiled.email = email;
    if (phone !== undefined) updateFiled.phone = phone;
    if (gender !== undefined) updateFiled.gender = gender;
    if (hometown !== undefined) updateFiled.hometown = hometown;
    if (date !== undefined) updateFiled.date = date;
    if (fullName !== undefined) {updateFiled.fullName=fullName;}
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      { $set: updateFiled },
      { new: true, runValidators: true }
    );
    if (!updateUser) {
      throw new BadRequestError("User not updated");
    }
    await redis.set(
      `${req.userId}`,
      JSON.stringify(updateUser),
      "EX",
      3600 * 24 * 3
    );
    res
      .status(200)
      .send({ message: "User updated successfully", user: updateUser });
  })
);

router.delete(
  "/delete-user/:userId",
  verifyTokenAndAdmin,
  asyncHandler(async (req: Request, res: Response, next: NextFunction) => {
    const { userId } = req.params;
    const user = await User.findByIdAndUpdate(userId, { isDeleted: true });

    if (!user) {
      throw new BadRequestError("User not found");
    }
    await redis.set(`${req.userId}`, JSON.stringify(user), "EX", 3600 * 24 * 3);
    res.status(200).send({ message: "User deleted successfully" });
  })
);

const handleName = (fullName: string) => {
  const namePart = fullName.trim().split(" ");
  const lastName = namePart[0];
  const firstName = namePart.slice(1).join(" ");
  return { firstName, lastName };
};

export default router;
