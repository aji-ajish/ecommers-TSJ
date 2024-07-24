import express from 'express';
import dotenv from 'dotenv'
import connectDB from './database/db.js';


const app = express();
dotenv.config({ path: './config/.env' })
const port = process.env.PORT;

// middleware
app.use(express.json());

// import routes
import userRoutes from "./routes/user.js"

// using routes
app.use("/api/", userRoutes)


app.listen(port, () => {
    console.log("server listening on ", port);
    connectDB()
    console.log("Database connection established");
})