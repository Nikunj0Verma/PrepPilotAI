const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

transporter.verify((error, success) => {
    if (error) {
        console.log("EMAIL TRANSPORTER ERROR:");
        console.log(error);
    } else {
        console.log("EMAIL SERVER IS READY");
    }
});

const sendResetEmail = async (email, resetUrl) => {
    try {
        const info = await transporter.sendMail({
            from: `"PrepPilot AI" <${process.env.EMAIL_USER}>`,
            to: email,
            subject: "Reset Your PrepPilot AI Password",
            html: `
                 <div style="font-family: Arial, sans-serif; padding: 20px;">
                <h2>Reset Your Password</h2>

                <p>
                    We received a request to reset your PrepPilot AI password.
                </p>

                <p>
                    Click the button below to create a new password:
                </p>

                <a href="${resetUrl}"
                   style="
                       display: inline-block;
                       padding: 12px 20px;
                       background: #2563eb;
                       color: white;
                       text-decoration: none;
                       border-radius: 8px;
                   ">
                    Reset Password
                </a>

                <p style="margin-top: 20px;">
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you didn't request a password reset, you can ignore
                    this email.
                </p>
            </div>
            `,
        });

        console.log("EMAIL SENT:", info.messageId);

    } catch (error) {
        console.log("SEND EMAIL ERROR:");
        console.log(error);
        throw error;
    }
};

module.exports = sendResetEmail;