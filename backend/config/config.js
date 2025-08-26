import mongoose from "mongoose";
// connection 
const connectDB = async (req , res) =>{
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`Mongodb Connected : ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error : ${error.message}`);
    }
}


export default connectDB ;