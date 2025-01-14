import mongoose from "mongoose";
import validator from "validator";

interface user {
    Firstname: string;
    Lastname: string;
    email: string; 
    password: string;
    imageUrl: string;
    age: number;
    gender: string;
    skills: [string]
}

const userSchema = new mongoose.Schema<user>({
    Firstname: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 25,
        trim: true
    },
    Lastname: {
        type: String, 
        minlength: 2,
        maxlength: 25,
        trim: true
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        validate: {
            validator : function(s: string) {
                return validator.isEmail(s);
        },
        message: 'Invalid Email', 
    },
    },

    password: {
        type: String,
        required: true,
        minlength: 8,
        validate: {
            validator : function(s: string) {
                return validator.isStrongPassword(s);
        },
        message: 'Invalid Password', 
    },
    },

    imageUrl : {
        type: String, 
        default: "",
        trim: true,
        validate: {
            validator : function(s: string) {
                return validator.isURL(s);
        },
        message: 'Invalid Url', 
    },

    },
    age: {
        type: Number, 
        required: true,
        min: 18,
        max: 100
    },
    gender: {
        type: String,
        enum: {
            values: ['male', 'female', 'transgender', 'other'],
            message: '{VALUE} is not supported',
        }
    },
    skills : {
        type : [String],
        validate: {
            validator : function(s: string[]) {
                return s.length <= 10;
        },
        message: 'Skills should be less than 10', 
    },
    },
}, {
    timestamps: true
})


const d_user = mongoose.model<user>('duser', userSchema);

export default d_user