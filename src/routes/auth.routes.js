

import express from "express";
import { signUp,signIn,updatePassword,resetPassword,validateOpt,sendForgotPasswordEmail } from "../controllers/authentication.controller.js";
//import { signUp, signIn, updatePassword, resetPassword, validateOpt, sendForgotPasswordEmail } from ''
const authRoutes = express.Router();

authRoutes.post('/signup', signUp);
authRoutes.post('/signin', signIn);
authRoutes.put('/updatepassword/:userId', updatePassword);
authRoutes.post('/resetpassword', resetPassword);
authRoutes.post('/validateopt', validateOpt);
authRoutes.post('/sendforgotpasswordemail', sendForgotPasswordEmail);

export default authRoutes;
