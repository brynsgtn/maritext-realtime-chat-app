import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/user.model.js";
import {
    sendVerificationEmail,
    sendWelcomeEmail,
    sendPasswordResetEmail,
    sendResetSuccessEmail,
    sendInviteEmail
} from "../lib/mailtrap/email.js";
import bcrypt from "bcryptjs";
import crypto from "crypto";

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

            await sendVerificationEmail(newUser.email, verificationToken, newUser.username);

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

        // to do - homepageURL
        sendWelcomeEmail(user.email, user.username);

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

        if (!password) {
            return res.status(400).json({ message: "Password is required" });
        }

        const user = await User.findOne({ $or: [{ 'email': usernameOrEmail }, { 'username': usernameOrEmail }] })

        if (!user) {
            return res.status(400).json({ message: "Invalid credentials" });
        };

        if (!user.isVerified) {
            return res.status(400).json({ message: "Account is not verified" });
        }

        const isPasswordValid = await bcrypt.compare(password, user.password);

        if (!isPasswordValid) return res.status(400).json({ message: "Invalid credentials" });

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

export const updateProfilePicture = async (req, res) => {
    try {
        const { profilePic } = req.body;
        const userID = req.user._id;

        if (!profilePic) return res.status(400).json({ message: "Profile picture is required " });

        const uploadResponse = await cloudinary.uploader.upload(profilePic);
        const updatedUser = await User.findByIdAndUpdate(userID, { profilePic: uploadResponse.secure_url }, { new: true });

        res.status(200).json({
            sucess: true,
            message: "Profile picture update successful",
            user: {
                ...updatedUser._doc,
                password: undefined,
            },
        });
    } catch (error) {
        console.log("error in updateProfilePicture controller:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const updateUserName = async (req, res) => {
    const { userName } = req.body;
    const userID = req.user._id;

    try {
        if (!userName) return res.status(400).json({ message: "Username is required" });

        if (userName.length < 6) return res.status(400).json({ message: "Username must be atleast 6 characters" });

        if (req.user.username === userName) {
            return res.status(400).json({ message: "This is already your current username" });
        }

        const userNameExists = await User.findOne({ username: userName, _id: { $ne: userID } });

        if (userNameExists) {
            return res.status(400).json({ message: "Username already exists" });
        }


        const updatedUserName = await User.findByIdAndUpdate(userID, { username: userName }, { new: true });

        res.status(200).json({
            sucess: true,
            message: "Username update successful",
            user: {
                ...updatedUserName._doc,
                password: undefined,
            },
        })
    } catch (error) {
        console.log("Error updating username:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const forgotPassword = async (req, res) => {
    const { email } = req.body;

    try {
        if (!email) return res.status(404).json({ message: "Email is required" });

        const user = await User.findOne({ email });

        if (!user) return res.status(404).json({ message: "User not doesn't exists" });

        // generate reset token
        const resetToken = crypto.randomBytes(20).toString("hex");
        const resetTokenExpiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 mins

        user.resetPasswordToken = resetToken;
        user.resetPasswordExpiresAt = resetTokenExpiresAt;

        await user.save();

        await sendPasswordResetEmail(user.email, user.username, `http://localhost:5001/reset-password/${resetToken}`);

        res.status(200).json({
            success: true,
            message: "Password reset link sucessful" // to be changed to "Password reset link sent to your email"
        })

    } catch (error) {
        console.log("Error in forgotPassword controller", error);
        res.status(400).json({ message: "Internal server error" });
    };
};

export const resetPassword = async (req, res) => {
    const { token } = req.params;
    const { password } = req.body;

    try {
        if (!password) return res.status(400).json({ message: "Password is required" });

        const user = await User.findOne({
            resetPasswordToken: token,
            resetPasswordExpiresAt: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ success: false, message: "Invalid or expired reset token" });
        };

        if (password.length < 6) return res.status(400).json({ message: "Password must be 6 characters" });

        // check if password input is the current password
        const isCurrentPassword = await bcrypt.compare(password, user.password);

        if (isCurrentPassword) return res.status(404).json({ message: "New password must be different from your current password" });

        // update password
        const hashedPassword = await bcrypt.hash(password, 10);

        user.password = hashedPassword;
        user.resetPasswordToken = undefined;
        user.resetPasswordExpiresAt = undefined;

        await user.save();

        sendResetSuccessEmail(user.email, user.username);

        res.status(200).json({ success: true, message: "Password reset successful" });

    } catch (error) {
        console.log("Error in resetPassword controller", error);
        res.status(400).json({ message: "Internal server error" });
    }
};

export const checkAuth = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password");

        if (!user) {
            return res.status(400).json({ success: false, message: "User not found" });
        };

        res.status(200).json({ success: true, user });
    } catch (error) {
        console.log("Error in checkAuth controller", error);
        res.status(400).json({ message: "Internal server error" });
    }
};

export const deleteUser = async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.userId);

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: 'User not found',
            });
        }

        return res.status(200).json({
            success: true,
            message: 'Account deleted',
        });
    } catch (error) {
        console.log("Error in deleteUser controller", error);
        res.status(400).json({ message: "Internal server error" });
    }
}

export const inviteUser = async (req, res) => {
    try {

        const { email } = req.body;
        const registrationURL = "http://localhost:5001/signup" // route in frontend

        if (!email) {
            return res.status(400).json({ error: 'Email is required' });
        }

        const userExists = await User.findOne({ email });

        if (userExists) return res.status(400).json({ success: false, message: "Email already registered" });


        await sendInviteEmail(email, registrationURL);


        res.status(200).json({ message: 'Invite email sent successfully' });
    } catch (error) {
        console.error('Error in inviteUser controller', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const resendVerificationEmail = async (req, res) => {
    const { email } = req.body;
    try {
        const user = await User.findOne({ email });

        if (!email) return res.status(400).json({ success: false, message: "Email is required" });
        if (!user) {
            return res.status(400).json({ success: false, message: 'User not found' });
        }

        if (user.isVerified) {
            return res.status(400).json({ success: false, message: 'User is already verified' });
        }

        const verificationToken = Math.floor(100000 + Math.random() * 900000).toString();
        user.verificationToken = verificationToken;
        user.verificationTokenExpiresAt = Date.now() + 5 * 60 * 1000 // 5 minutes

        await user.save();

        await sendVerificationEmail(user.email, verificationToken, user.username);

        res.status(200).json({
            success: true,
            message: 'Verification email resent successfully',
        });
    } catch (error) {
        console.error('Error in resendVerificationEmail controller:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

// to do - improve inviteUser logic validation (e.g. already invited etc.)