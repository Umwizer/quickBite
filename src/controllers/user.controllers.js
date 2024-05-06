import bcrypt from "bcryptjs";
import asyncWrapper from "../middleware/sync.js";
import userModel from "../models/users.models.js";
import { BadRequestError } from "../errors/badRequestError.js";
import { validationResult } from "express-validator";
import { optGenerator } from "../utils/opt.js";
import { sendEmail } from "../utils/sendEmail.js";
import { UnauthorizedError } from "../errors/UnauthorizedError.js";
import jwt from "jsonwebtoken";

export const authenticateUser = async (req, res, next) => {
  try {
    const token = req.headers.authorization;
    if (!token) {
      throw new UnauthorizedError("Access token is missing");
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    next(new UnauthorizedError("Invalid access token"));
  }
};

export const authorizeUser = (req, res, next) => {
  next();
};

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
  const otp = optGenerator()
  const optExpirationDate = new Date().getTime()+(24*60*60*1000);
  const user = await userModel({
    firstname: req.body.firstname,
    lastname: req.body.lastname,
    username: req.body.username,
    email: req.body.email,
    phoneNumber: req.body.phoneNumber,
    password: hashedPassword,
    otp:otp,
    optExpires:optExpirationDate
  });
  const savedUser = await user.save();
  await sendEmail(req.body.email,"Verify your account",`your opt is ${otp}`);
  if (savedUser) {
    return res.status(200).json({
      message: "User created successfully",
      user: savedUser,
    });
  }
}, authenticateUser, authorizeUser);

export const validateOpt = asyncWrapper(async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    next( new BadRequestError(errors.array()[0].msg));
  }
  const foundUser = await userModel.findOne({opt:req.body.opt}) 
  if (!foundUser) {
    next( new BadRequestError("Authorization denied"));
  }
  if(foundUser.optExpires < new Date().getTime()) {
      next(new UnauthorizedError('OTP expires'))
  }
  foundUser.verifies = true;
  const savedUser = await foundUser.save();
  if(savedUser){
      return res.status(200).json({
          message:"User account verified",
          user:savedUser
      })
  }
}, authenticateUser, authorizeUser);

export const getAllUsers = asyncWrapper(async (req, res, next) => {
  const users = await userModel.find();
  return res.status(200).json(users);
}, authenticateUser, authorizeUser);

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
}, authenticateUser, authorizeUser);

export const getById = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findById(req.params.id);
  if (!user) {
    return next(new BadRequestError("User not found"));
  }
  return res.status(200).json(user);
}, authenticateUser, authorizeUser);

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
}, authenticateUser, authorizeUser);

export const deleteUser = asyncWrapper(async (req, res, next) => {
  const user = await userModel.findByIdAndDelete(req.params.id);
  if (!user) {
    return next(new BadRequestError("User not found"));
  }
  return res.status(200).json({ message: "User deleted successfully" });
}, authenticateUser, authorizeUser);

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
  const token = jwt.sign({ id: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "24h" });
  
  return res.status(200).json({
    message: "User logged in successfully",
    token,
  });
});
