import jwt from "jsonwebtoken";
import userModel from "../models/users.models.js";
import { BadRequestError } from "../errors/index.js";
import asyncWrapper  from "../middleware/sync.js";
import bcrypt from "bcryptjs";
import { resetPasswordWithToken } from "../utils/resetPasswordWithToken.js";
import { sendEmail } from "../utils/sendEmail.js";

export const signUp = asyncWrapper(async (req, res, next) => {
  const { firstname, lastname, username, email, phoneNumber, password } =
    req.body;

  const existingUser = await userModel.findOne({ email });
  if (existingUser) {
    throw new BadRequestError("User already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 12);

  const newUser = await userModel.create({
    firstname,
    lastname,
    username,
    email,
    phoneNumber,
    password: hashedPassword,
  });

  return res.status(201).json({
    message: "User created successfully",
    user: newUser,
  });
});

export const signIn = asyncWrapper(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await userModel.findOne({ email });
  if (!user) {
    throw new BadRequestError("Invalid email or password");
  }

  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    throw new BadRequestError("Invalid email or password");
  }

  const token = jwt.sign(
    { id: user._id, email: user.email },
    process.env.JWT_SECRET,
    { expiresIn: "24h" }
  );

  return res.status(200).json({
    message: "User logged in successfully",
    token,
  });
});

export const validateOpt = asyncWrapper(async (req, res, next) => {
    const { opt } = req.body;
  
    const user = await userModel.findOne({ otp: opt });
    if (!user) {
      throw new BadRequestError("Invalid OTP");
    }
    if (user.optExpires < Date.now()) {
      throw new BadRequestError("OTP has expired");
    }
    user.verified = true;
    await user.save();
  
    return res.status(200).json({ message: "OTP validated successfully" });
  });
  

export const updatePassword = asyncWrapper(async (req, res, next) => {
    const { userId } = req.params;
    const { oldPassword, newPassword } = req.body;
  
    const user = await userModel.findById(userId);
    if (!user) {
      throw new BadRequestError("User not found");
    }

    const passwordMatch = await bcrypt.compare(oldPassword, user.password);
    if (!passwordMatch) {
      throw new BadRequestError("Old password is incorrect");
    }
    const hashedPassword = await bcrypt.hash(newPassword, 12);
    user.password = hashedPassword;
    await user.save();
  
    return res.status(200).json({ message: "Password updated successfully" });
  });
 
  export const sendForgotPasswordEmail = asyncWrapper(async (req, res, next) => {
    const { email } = req.body;
    const user = await userModel.findOne({ email });
    if (!user) {
      throw new BadRequestError("User not found");
    }
    try {
      const resetToken = generateResetTokenasync(user);
      await sendEmail(user.email, "Password Reset", `Click here to reset your password: ${resetToken}`);
      return res.status(200).json({ message: "Password reset link sent successfully" });
    } catch (error) {
      throw new BadRequestError("Failed to send password reset email");
    }
  });
  

export const resetPassword = asyncWrapper(async (req, res, next) => {
  const { token, newPassword } = req.body;
  
  try {
    const result = await resetPasswordWithToken(token, newPassword);
    return res.status(200).json(result);
  } catch (error) {
    return next(error);
  }
});

  
  
  
