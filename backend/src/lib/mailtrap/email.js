import { mailtrapClient, sender } from "./mailtrapConfig.js";
import {
    VERIFICATION_EMAIL_TEMPLATE,
    WELCOME_EMAIL_TEMPLATE,
    PASSWORD_RESET_REQUEST_TEMPLATE,
    PASSWORD_RESET_SUCCESS_TEMPLATE,
    REGISTRATION_INVITE_REQUEST_TEMPLATE
} from "./emailTemplate.js";

export const sendVerificationEmail = async (email, verificationToken, username) => {
    const recipient = [{ email }];
    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Verify your email",
            html: VERIFICATION_EMAIL_TEMPLATE
                .replace("{verificationCode}", verificationToken)
                .replace("{username}", username),
            category: "Email Verification",
        });
        console.log("Email sent successfully", response);
    } catch (error) {
        console.error(`Error sending verification`, error);
        throw new Error(`Error sending verification email: ${error}`);
    };
};

export const sendWelcomeEmail = async (email, username, homepageURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Welcome to Maritext Chat!",
            html: WELCOME_EMAIL_TEMPLATE
                .replace(/{email}/g, email)
                .replace(/{username}/g, username)
                .replace(/{homepageURL}/g, homepageURL),
            category: "Welcome Email",
        });
        console.log("Welcome email sent successfully", response);
    } catch (error) {
        console.error(`Error sending welcome email`, error);
        throw new Error(`Error sending welcome email: ${error}`);

    };
};

export const sendPasswordResetEmail = async (email, username, resetURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Reset your password",
            html: PASSWORD_RESET_REQUEST_TEMPLATE
            .replace("{resetURL}", resetURL)
            .replace("{username}", username),
            category: "Password Reset",
        });
    } catch (error) {
        console.error(`Error sending password reset email`, error);
        throw new Error(`Error sending password reset email: ${error}`);
    }
};

export const sendResetSuccessEmail = async (email, username) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "Password Reset Successful",
            html: PASSWORD_RESET_SUCCESS_TEMPLATE
            .replace("{username}", username),
            category: "Password Reset",
        });

        console.log("Password reset email sent successfully", response);
    } catch (error) {
        console.error(`Error sending password reset email`, error);

		throw new Error(`Error sending password reset email: ${error}`);
    }
}

export const sendInviteEmail = async (email, registrationURL) => {
    const recipient = [{ email }];

    try {
        const response = await mailtrapClient.send({
            from: sender,
            to: recipient,
            subject: "You're Invited to Join Maritext Chat App",
            html: REGISTRATION_INVITE_REQUEST_TEMPLATE
            .replace("{registrationURL}", registrationURL),
            category: "Registration Invitation",
        });

        console.log(`Invite email sent successfully to ${email}`, response);
    } catch (error) {
        console.error(`Error sending invite email to ${email}`, error);
        throw new Error(`Error sending invite email: ${error}`);
    }
};
