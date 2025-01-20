import mongoose, { Schema, Document} from 'mongoose';

interface Connection extends Document{
    senderId: mongoose.Schema.Types.ObjectId;
    receiverId: mongoose.Schema.Types.ObjectId;
    status: string;
}
const connectionSchema = new mongoose.Schema<Connection>({
    senderId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
    }  ,

    receiverId : {
        type: mongoose.Schema.Types.ObjectId,
        required: true, 
    },

    status : {
        type: String,
        required: true,
        enum: {
            values: ['accepted', 'pending', 'interested', 'ignored', 'blocked'],
            message: 'Invalid Status'
        }
    }, 
    },
    {
        timestamps: true
    }
)

connectionSchema.index({senderId: 1, receiverId: 1}, {unique: true});

connectionSchema.pre<Connection>('save', function(next) : void{
    
    const connectionRequest = this;
    const sender = connectionRequest.senderId.toString();
    const receiver = connectionRequest.receiverId.toString();
    
    if (sender === receiver) {
        throw new Error('Connot send connection request to yourself');
    }
    next();
    
})

const connectionRequest = mongoose.model<Connection>('connection', connectionSchema);
export default connectionRequest;