export const VERIFICATION_EMAIL_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Verify Your Email</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0f4f8; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Verify Your Email</h1>
    </div>
    
    <!-- Content -->
    <div style="padding: 30px 20px; background-color: #ffffff;">
      <p style="font-size: 16px;">Hello {username},</p>
      <p style="font-size: 16px;">Thank you for signing up! Your verification code is:</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <span style="display: inline-block; padding: 12px 24px; font-size: 26px; font-weight: bold; letter-spacing: 4px; background-color: #ecfdf5; color: #16a34a; border: 2px dashed #16a34a; border-radius: 8px;">
          {verificationCode}
        </span>
      </div>
      
      <p style="font-size: 16px;">Enter this code on the verification page to complete your registration. This code will expire in <strong>5 minutes</strong>.</p>
      <p style="font-size: 16px;">If you didn't create an account with us, please ignore this email.</p>
      <p style="font-size: 16px;">Best regards,<br><strong>Maritext Chat</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #f9fafb; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>
    
  </div>
</body>
</html>

`;

export const PASSWORD_RESET_SUCCESS_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Password Reset Successful</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0f4f8; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Password Reset Successful</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px; background-color: #ffffff;">
      <p style="font-size: 16px;">Hello {username},</p>
      <p style="font-size: 16px;">We're confirming that your password has been successfully updated.</p>
      
      <div style="text-align: center; margin: 30px 0;">
        <div style="background-color: #22c55e; color: white; width: 60px; height: 60px; line-height: 60px; border-radius: 50%; display: inline-block; font-size: 32px;">
          ✓
        </div>
      </div>

      <p style="font-size: 16px;">If you did not request this change, please contact our support team immediately.</p>
      <p style="font-size: 16px;">For your security, we recommend that you:</p>
      <ul style="padding-left: 20px; font-size: 16px;">
        <li>Use a strong and unique password</li>
        <li>Keep your login credentials private</li>
        <li>Avoid reusing passwords across different websites</li>
      </ul>

      <p style="font-size: 16px;">Thank you for taking steps to keep your account secure.</p>
      <p style="font-size: 16px;">Best regards,<br><strong>Maritext Chat App</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #f9fafb; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>

  </div>
</body>
</html>

`;

export const PASSWORD_RESET_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Reset Your Password</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0f4f8; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Reset Your Password</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px;">
      <p style="font-size: 16px;">Hello {username},</p>
      <p style="font-size: 16px;">We received a request to reset your password. If you did not initiate this request, you can safely ignore this message.</p>
      <p style="font-size: 16px;">To continue with resetting your password, click the button below:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{resetURL}" style="background-color: #22c55e; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Reset Password</a>
      </div>

      <p style="font-size: 16px;">This link will expire in 5 minutes for security reasons.</p>
      <p style="font-size: 16px;">Best regards,<br><strong>Maritext Web App</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #f9fafb; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>

`;

export const REGISTRATION_INVITE_REQUEST_TEMPLATE = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Join Our App</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0f4f8; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">You're Invited to Join Maritext Chat!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px;">
      <p style="font-size: 16px;">Hello,</p>
      <p style="font-size: 16px;">We’re excited to invite you to join <strong>Maritext Chat</strong>, where you can connect, collaborate, and communicate with ease.</p>
      <p style="font-size: 16px;">Click the button below to create your account and get started:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{registrationURL}" style="background-color: #22c55e; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Join Now</a>
      </div>

      <p style="font-size: 16px;">This invitation is valid for the next 24 hours.</p>
      <p style="font-size: 16px;">We look forward to having you on board!</p>
      <p style="font-size: 16px;">Best regards,<br><strong>The Maritext Chat Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #f9fafb; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>

`;

export const WELCOME_EMAIL_TEMPLATE =`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
  <title>Welcome to Maritext Chat</title>
</head>
<body style="font-family: 'Segoe UI', sans-serif; background-color: #f0f4f8; padding: 30px 15px;">
  <div style="max-width: 600px; margin: 0 auto; background-color: #ffffff; border-radius: 8px; overflow: hidden; box-shadow: 0 4px 10px rgba(0,0,0,0.1);">
    
    <!-- Header -->
    <div style="background: linear-gradient(90deg, #22c55e, #16a34a); padding: 30px 20px; text-align: center;">
      <h1 style="color: white; margin: 0; font-size: 28px;">Welcome to Maritext Chat, {username}!</h1>
    </div>

    <!-- Content -->
    <div style="padding: 30px 20px;">
      <p style="font-size: 16px;">Hi <strong>{username}</strong>,</p>
      <p style="font-size: 16px;">Your account (<strong>{email}</strong>) has been successfully created. We're thrilled to have you join <strong>Maritext Chat</strong>—your new space to connect, collaborate, and chat with others.</p>
      <p style="font-size: 16px;">Click the button below to visit your homepage and start exploring:</p>

      <div style="text-align: center; margin: 30px 0;">
        <a href="{homepageURL}" style="background-color: #22c55e; color: white; padding: 14px 24px; text-decoration: none; border-radius: 6px; font-weight: bold; font-size: 16px;">Go to Homepage</a>
      </div>

      <p style="font-size: 16px;">We’re here if you need any help getting started.</p>
      <p style="font-size: 16px;">Warm regards,<br><strong>The Maritext Chat Team</strong></p>
    </div>

    <!-- Footer -->
    <div style="text-align: center; padding: 15px; background-color: #f9fafb; color: #6b7280; font-size: 13px;">
      <p style="margin: 0;">This is an automated message. Please do not reply.</p>
    </div>
  </div>
</body>
</html>

`;