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
import productRoutes from "./routes/product.js"

// static files
app.use("/uploads",express.static("uploads"))

// using routes
app.use("/api/", userRoutes)
app.use("/api/", productRoutes)


app.listen(port, () => {
    console.log("server listening on ", port);
    connectDB()
    console.log("Database connection established");
})