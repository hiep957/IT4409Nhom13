import jwt, { JwtPayload } from "jsonwebtoken";
import { NextFunction, Request, Response } from "express";
declare global {
  namespace Express {
    interface Request {
      userId: string;
      role: string;
    }
  }
}
export const verifyToken = (req: Request, res: Response, next: NextFunction) => {
  
  const token = req.cookies['Auth_Token'];
  if (!token) {
    return res.status(401).json({ mes: "unAuthorization" });
  }
  try {
    console.log(token);
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY as string);
    req.userId = (decoded as JwtPayload).userId;
    req.role = (decoded as JwtPayload).role;
    console.log(req.userId);
    console.log(req.role);
    next();
  } catch (err) {
    if (typeof err === "string") {
      res.status(500).json({ mes: err });
    } else {
      res.status(500).json({ mes: "Unknown error occurred" });
    }
    // return res.status(400).json({ message: err.array() })
  }

};

export const verifyTokenAndAdmin = (req: Request, res: Response, next: NextFunction) => {
  verifyToken(req, res, () => {
    if (req.role === "admin") {
      next();
    } else {
      res.status(403).json({ message: "You're not allowed to do that" });
    }
  })
}


