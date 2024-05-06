import {body} from 'express-validator';
export const signUpValidations = [

    body("firstname", "First name is required").not().isEmpty(),
    body("lastname", "Last name is required").not().isEmpty(),
    body("username", "Username is required").not().isEmpty(),
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "password should contain uppercase , lowercase letters,numbers and strong symbols").isStrongPassword(),
]
export const signInValidations = [
    body("email", "Email is required").not().isEmpty(),
    body("email", "Invalid email").isEmail(),
    body("password", "Password is required").not().isEmpty(),
    body("password", "Invalid password").isStrongPassword()
]

export const  addValidation = [
body("name","name of restaurant is required").not().isEmpty(),
body("description","description of restaurant is required").not().isEmpty(),
body("location","location of restaurant is required").not().isEmpty(),
body("phoneNumber","phone number of restaurant is required").not().isEmpty(),
body("menu","menu of restaurant is required").not().isEmpty(),
body("openingHours","opening hours of restaurant is required").not().isEmpty(),
]

export const menuValidation = [
    body("name","name of restaurant is required").not().isEmpty(),
    body("description","description of restaurant is required").not().isEmpty(),
    body("price","price of restaurant is required").not().isEmpty(),
    body("category","category of restaurant is required").not().isEmpty(),
    body("restaurant","restaurant of ordered food is required").not().isEmpty()
]
export const orderValidation = [
    //body("customer","customer identity is required").not().isEmpty(),
    // body("MenuItem","items identity is required").not().isEmpty(),
    // body("total","total number of items is required").not().isEmpty(),

]