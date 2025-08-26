import express from "express" ;
import dotenv from "dotenv";
import connectDB from "./config/config.js";

dotenv.config();
const PORT = process.env.PORT || 4000; 
const app = express();

app.use(express.json());
app.use(express.urlencoded({extended : true}));


// Auth Routes
app.get("/" , (req , res) => {
    res.send("API is running...");
} )



app.listen(PORT ,()=> {
    console.log("Server is running on PORT :" , PORT);
    connectDB();
});