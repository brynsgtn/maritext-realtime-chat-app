import jwt from "jsonwebtoken";

export const generateToken = (userId, res) => {
    const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
        expiresIn: "7d",
    });

    const isProduction = process.env.NODE_ENV === "production";

    res.cookie("jwt", token, {
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in ms
        httpOnly: true,
        sameSite: isProduction ? "None" : "Lax",  // ✅ Safari-safe
        secure: isProduction,                    // ✅ Only secure on HTTPS
    });
    return token;
};