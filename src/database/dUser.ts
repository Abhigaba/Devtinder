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
    skills: [string];
    about: String
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
        default: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRk23C2TJSGGhXWgGy_tSnCEsk3ek6_VqW6oQ&s",
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
    about: {
        type: String, 
        default : "" ,
        min : 20, 
        max: 500,
    },
    gender: {
        type: String,
        default: "other",
        enum: {
            values: ['male', 'female', 'transgender', 'other'],
            message: '{VALUE} is not supported',
        }
    },
    skills : {
        type : [String],
        default: [],
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