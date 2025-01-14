import mongoose from "mongoose";


const connectdb = async () => {

    try {
        const conn = await mongoose.connect('mongodb+srv://abhi:Abhi33624512@projects.cxdmr.mongodb.net/?retryWrites=true&w=majority&appName=Projects', {
        });
        console.log(`Database Connected`);
        return conn;
    } catch (error: any) {
        console.error(`Error: ${error.message}`);
        process.exit(1);
    }
}

export default connectdb;