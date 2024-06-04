import express, { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import Auth from "../middleware/auth";
import User from "../models/UsersModel";
import { check, validationResult } from "express-validator";

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
  async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ message: error.array() });
    }
    try {
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res.status(400).json({ message: "User already exists" });
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
    } catch (error) {
      console.log(error);
      res.status(500).send({ message: "Something went wrong" });
    }
  }
);
router.post(
  "/login",
  [
    check("email", "Email is required").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
  ],
  async (req: Request, res: Response) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
      return res.status(400).json({ message: error.array() });
    }

    const { email, password } = req.body;

    try {
      const user = await User.findOne({ email });
      if (!user) {
        return res.status(400).json({ message: "User not found" });
      }

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: "Password mismatch" });
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
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Something went wrong" });
    }
  }
);
router.post("/logout", (req: Request, res: Response) => {
  res.cookie("Auth_Token", "", {
    expires: new Date(0),
  });
  res.send();
});

router.get("/view_user", Auth, async (req: Request, res: Response) => {
  try {
    const ViewUser = await User.findById(req.userId).select("-password");
    if (!ViewUser) {
      return res.status(400).json({ msg: "User not found" });
    }
    res.json(ViewUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});
router.get("/validate-token", Auth, (req: Request, res: Response) => {
  try {
    console.log("checkvalidate");
    res.status(200).send({ userId: req.userId });
  } catch (error) {
    console.log(error);
    res.status(500).json({ msg: "Something went wrong" });
  }
});

router.put("/edit-info", Auth, async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, email, phone, gender, hometown, date } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(400).json({ message: "User not found" });
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
  } catch (error) {
    res.status(500).json({msg: (error as Error).message});
    
  }
})
export default router;
