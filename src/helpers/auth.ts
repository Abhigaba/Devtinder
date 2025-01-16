import bcrypt, { hash } from 'bcrypt'; 
import  jwt  from 'jsonwebtoken';
export const  signUp = async (password: string) => {

    try {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);
    return   hashedPassword;}

    catch (error) { 
        throw new Error('Unknown error occured');
    }
}

export const validatePassword = async (findUser:any, password: string) => { 

    try { 
        const correctPass = await bcrypt.compare(password,findUser.password);
        if (!correctPass) {throw new Error('Invalid Credentials')}
        const token = await jwt.sign({ _id: findUser._id },'shhhhh',{expiresIn: '7h'});
        return token
    }
    catch(error) { 
        throw new Error('Invalid Credentials' );
    }
}