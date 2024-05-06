
import jwt from "jsonwebtoken";
import { UnauthorizedError } from "../errors/index.js";

export const authenticateUser = (req, res, next) => {

  const token = req.headers.authorization;
  if (!token) {
    throw new UnauthorizedError("Access token is missing");
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded; 
    next();
  } catch (error) {
    throw new UnauthorizedError("Invalid access token");
  }
};
