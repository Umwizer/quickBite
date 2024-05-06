
import jwt from "jsonwebtoken";
import userModel from "../models/users.models.js";
import { BadRequestError, UnauthorizedError } from "../errors/index.js";
import bcrypt from "bcryptjs";

export const resetPasswordWithToken = async (token, newPassword) => {
  const decodedToken = jwt.verify(token, process.env.JWT_SECRET);
  if (!decodedToken) {
    throw new UnauthorizedError("Invalid or expired reset token");
  }

  const user = await userModel.findById(decodedToken.id);
  if (!user) {
    throw new BadRequestError("User not found");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);
  user.password = hashedPassword;
  await user.save();

  return { message: "Password reset successfully" };
};
