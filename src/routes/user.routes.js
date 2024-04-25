import express from 'express';
const userRouter = express.Router();
import { signUp,SignIn,getAllUsers, getByEmail, getById, updateUser, deleteUser} from '../controllers/user.controllers.js';
import { signUpValidations, signInValidations } from '../utils/validation.js';

userRouter.post('/signup', signUpValidations, signUp);
userRouter.post('/signin', signInValidations, SignIn);
userRouter.get('/signup/getByEmail/:email', getByEmail); 
userRouter.get('/signup/getById/:id', getById); // Route to fetch user by ID
userRouter.get('/signup/getAllUsers', getAllUsers); // Route to fetch all users
userRouter.put('/signup/updateUser/:id', signUpValidations, updateUser); // Route to update user by ID
userRouter.delete('/signup/deleteUser/:id', deleteUser);
export default userRouter