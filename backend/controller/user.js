import { User } from "../models/User.js";
import bcrypt from "bcryptjs"
import jwt from "jsonwebtoken"
import sendMail from "../middleware/sendMail.js";

// new user registration
export const registerUser = async (req, res) => {
    try {
        const { name, email, password, contact } = req.body;

        // check email already exists   
        let user = await User.findOne({ email })
        if (user) {
            return res.status(400).json({
                message: "User Email Already Exists"
            })
        }

        // convert password to hash password
        const hashPassword = await bcrypt.hash(password, 10)

        // generate otp
        const otp = Math.floor(Math.random() * 1000000)

        // create new user
        user = { name, email, hashPassword, contact }

        // create signed activation token
        const activationToken = jwt.sign({ user, otp }, process.env.ACTIVATION_SECRET, {
            expiresIn: "5m"
        })

        // send mail to user
        const message = `please verify your account using otp your otp is ${otp}`
        await sendMail(email, "Welcome to Ecomm", message)

        return res.status(200).json({
            message: "OTP Send to your mail",
            activationToken
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// verify OTP
export const verifyUser = async (req, res) => {

    try {
        const { otp, activationToken } = req.body
        let verify;
        try {
            verify = jwt.verify(activationToken, process.env.ACTIVATION_SECRET);
        } catch (error) {
            return res.status(400).json({ message: "Invalid or expired activation token" });
        }

        if (!verify) {
            return res.status(400).json({
                message: "OTP Expired"
            })
        }

        await User.create({
            name: verify.user.name,
            email: verify.user.email,
            password: verify.user.hashPassword,
            contact: verify.user.contact
        })
        return res.status(200).json({
            message: "User Registration Success"
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// user Login
export const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body
        // check user email address
        const user = await User.findOne({ email })
        if (!user) {
            return res.status(500).json({
                message: "Invalid Credentials"
            })
        }

        // check password
        const matchPassword = await bcrypt.compare(password, user.password)
        if (!matchPassword) {
            return res.status(500).json({
                message: "Invalid Credentials"
            })
        }

        // generate sign token
        const token = jwt.sign({ _id: user.id }, process.env.JWT_SECRET, { expiresIn: "15d" })

        // exclude the password field before sending
        const { password: userPassword, ...userDetails } = user.toObject()
        return res.status(200).json({
            message: "Welcome " + user.name,
            token,
            user:userDetails
        })

    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}

// user profile
export const myProfile=async (req, res) => {
    
    try {
        const user=await User.findById(req.user._id).select("-password")
        return res.status(200).json({
            message: user
        })
    } catch (error) {
        return res.status(500).json({
            message: error.message
        })
    }
}