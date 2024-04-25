import bcrypt from "bcryptjs";
import asyncWrapper from "../middleware/sync.js";
import userModel from "../models/users.models.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { validationResult } from "express-validator";
export const signUp = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw new BadRequestError(errors.array()[0].msg);
  }
  const foundUser = await userModel.findOne({ email: req.body.email });
  if (foundUser) {
    throw new BadRequestError("User already exists");
  }
  const hashedPassword = await bcrypt.hash(req.body.password, 12);
  const user = await userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hashedPassword,
  });
  const savedUser = await user.save();
  if (savedUser) {
    return res.status(200).json({
      message: "User created successfully",
      user: savedUser,
    });
  }
});
export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await userModel.find();
  return res.status(200).json(users);
});
export const getByEmail = asyncWrapper(async (req, res, next) => {
    try {
        
      const email = req.body.email;
      const user = await userModel.findOne({ email: email });
      if (!user) {
        return next(new BadRequestError("User not found"));
      }
      return res.status(200).json({ user: user });
    } catch (error) {
      return next(error);
    }
  });
  
export const getById = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new BadRequestError("User not found"));
  }
  return res.status(200).json(user);
});
export const updateUser = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }
  const user = await userModel.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
  });
  if (!user) {
    return next(new BadRequestError("User not found"));
  }
  return res.status(200).json(user);
});
export const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new BadRequestError("User not found"));
  }
  return res.status(200).json({ message: "User deleted successfully" });
});
export const SignIn = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return next(new BadRequestError(errors.array()[0].msg));
  }
  const { email, password } = req.body;
  const user = await userModel.findOne({ email });
  if (!user) {
    return next(new BadRequestError("Invalid email"));
  }
  const passwordMatch = await bcrypt.compare(password, user.password);
  if (!passwordMatch) {
    return next(new BadRequestError("Invalid password"));
  }
  return res.status(200).json({
    message: "User logged in successfully",
    user: user,
  });
});
