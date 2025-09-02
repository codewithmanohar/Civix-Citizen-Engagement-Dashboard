import express from "express" ;
import dotenv from "dotenv";
import connectDB from "./config/config.js";
import authRoutes from "./routes/auth.route.js";
import verifyRoutes from './routes/verify.route.js';
import cors from "cors"


dotenv.config();
const PORT = process.env.PORT || 4000; 
const app = express();


app.use(express.json());
app.use(express.urlencoded({extended : true}));
app.use(cors({
    origin : "http://localhost:5173", 
    credentials : true 
}));

app.get("/" , (req , res) => {
    res.send("API is running...");
})

app.use("/api/auth" , authRoutes);

app.use("/api/verify" , verifyRoutes);



app.listen(PORT ,()=> {
    console.log("Server is running on PORT :" , PORT);
    connectDB();
});