import { generateToken } from "../lib/utils.js";
import { User } from "../models/user.model.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
    const { email, username, password } = req.body;

    try {
        if (!email || !username || !password) return res.status(400).json({ message: "All fields are required" });

        if (password.length < 6) return res.status(400).json({ message: "Password must be 6 characters" });

        const userEmail = await User.findOne({ email });

        if (userEmail) return res.status(400).json({ message: "Email already exists" });

        const userName = await User.findOne({ username });

        if (userName) return res.status(400).json({ message: "Username already exists" });

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();

        const newUser = new User(
            {
                email,
                username,
                password: hashedPassword,
                verificationToken,
                verificationTokenExpiresAt: Date.now() + 24 * 60 * 60 * 1000
            },
        );

        if (newUser) {
            // generate token
            generateToken(newUser._id, res);
            await newUser.save();
            // to do - send verification email
            // await sendVerificationEmail(user.email, verificationToken);

            res.status(201).json({
                _id: newUser._id,
                email: newUser.email,
                username: newUser.username,
                profilePic: newUser.profilePic,
                lastLogin: newUser.lastLogin,
                isVerified: newUser.isVerified,
                verificationToken: newUser.verificationToken,
                verificationTokenExpiresAt: newUser.verificationTokenExpiresAt
            })
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = (req, res) => {
    console.log("verifyEmail");
    res.send("verifyEmail");
};

export const login = (req, res) => {
    console.log("Login");
    res.send("Login User");
};

export const logout = (req, res) => {
    console.log("Logout");
    res.send("Logout");
};

export const updateProfile = (req, res) => {
    console.log("updateProfile");
    res.send("updateProfile");
};

export const forgotPassword = (req, res) => {
    console.log("forgotPassword");
    res.send("forgotPassword");
};

export const resetPassword = (req, res) => {
    console.log("resetPassword");
    res.send("resetPassword");
};

export const checkAuth = (req, res) => {
    console.log("checkAuth");
    res.send("checkAuth");
};