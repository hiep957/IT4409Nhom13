import express, { Request, Response } from "express";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import Auth from "../middleware/Auth";
import User from "../models/UsersModel";
import { check, validationResult } from "express-validator";

const router = express.Router();

router.get("/me", Auth, async (req, res) => {
  const userId = req.body;
});
router.post(
  "/register",
  [
    check("firstName", "First Name is required").isString(),
    check("lastName", " Last Name is requires").isString(),
    check("email", "Email is requires").isEmail(),
    check("password", "Password with 6 or more characters required").isLength({
      min: 6,
    }),
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
      });
      await user.save();

      const token = jwt.sign(
        {
          usedId: user.id,
        },
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
  }
);
router.post("/view/");
router.get("/viewall");

export default router;