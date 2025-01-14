import { Request } from "express"
import validator from 'validator';

export const validateSignUp = (req : Request) => {

    const {email, password, Firstname, Lastname}  = req.body;

    if (!validator.isEmail(email)) { 
        throw new Error('Invalid email');
    }

    if (!validator.isLength(password, { min: 8 }) && !validator.isStrongPassword(password)) {
        throw new Error('Invalid password');
    }

    if (!validator.isLength(Firstname, { max: 20 })) {
        throw new Error('Invalid First Name');
    }

    if (!validator.isLength(Lastname, { max: 20 })) {
        throw new Error('Invalid Last Name');
    }

    return true;
    
}
