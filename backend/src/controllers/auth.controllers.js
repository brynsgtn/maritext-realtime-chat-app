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
                sucess: true,
                message: "Account created",
                user: {
                    ...newUser._doc,
                    password: undefined,
                },
            })
        } else {
            res.status(400).json({ message: "Invalid user data" });
        }
    } catch (error) {
        console.log("Error in signup controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const verifyEmail = async (req, res) => {
    const { code } = req.body;

    try {
        if (!code) return res.status(400).json({ message: "Verification code is required" });

        const user = await User.findOne({
            verificationToken: code,
            verificationTokenExpiresAt: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: "Invalid or expired verification token" });

        user.isVerified = true,
            user.verificationToken = undefined,
            user.verificationTokenExpiresAt = undefined

        await user.save();

        // to do - send welcome email

        res.status(200).json({
            sucess: true,
            message: "Account verified",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("error in verifyEmail controller", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const login = async (req, res) => {
    const { usernameOrEmail, password } = req.body;

    try {

        if (!usernameOrEmail) {
            return res.status(400).json({ message: "Email or username is required" });
        }

        if(!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({$or: [{'email': usernameOrEmail}, {'username': usernameOrEmail}]})

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        };

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account is not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if(!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

        generateToken(user._id, res);

        user.lastLogin = Date.now();

        await user.save();

        res.status(200).json({
            sucess: true,
            message: "Login successful",
            user: {
                ...user._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("error in login controller", error);
        res.status(500).json({ success: false, message: "Server error" });
    }
};

export const logout = (req, res) => {
    try {
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).json({ message: "Logged out successfully" });
    } catch (error) {
        console.log("Error in logout controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
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