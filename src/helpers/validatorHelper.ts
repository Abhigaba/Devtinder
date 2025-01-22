import { Request } from "express"
import validator from 'validator';

export const validateSignUp = (req : Request) => {

    const {email, password, Firstname, Lastname}  = req.body;
    

    if (!validator.isEmail(email)) { 
        return false
    }

    if (!validator.isLength(password, { min: 8 }) && !validator.isStrongPassword(password)) {
        return false
    }
    return true; 
}

export const validateLogIn = (req: Request) => {

    const {email} = req.body ; 

    if (!validator.isEmail(email) ) { 
        throw new Error('Invalid Credentials');
    }
}

export const validateEditableFields = (req : Request) => {


    if (Object.keys(req.body).length === 0) {
        return false
    }
    const requiredFields = ['Firstname', 'Lastname', 'age', 'gender', 'skills', "about"] ;
     
    const isEditable = Object.keys(req.body).every((k) => {
        if (!requiredFields.includes(k)) {
            return false 
        }
        return true
    })


    if (!isEditable) {
        return false
    }
    return true;
}

export const validChangePassword = (req: Request) => { 

    const {newPassword, confirmPassword} = req.body;
    if (!validator.isLength(newPassword, { min: 8 }) || !validator.isStrongPassword(newPassword) || newPassword !== confirmPassword) {
        return false
    }
    return true;
}