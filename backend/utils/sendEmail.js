const { Resend } = require("resend");

const resend = new Resend(process.env.RESEND_API_KEY);

const sendResetEmail = async (email, resetUrl) => {
    const { data, error } = await resend.emails.send({
        from: "PrepPilot AI <onboarding@resend.dev>",
        to: [email],
        subject: "Reset Your PrepPilot AI Password",
        html: `
            <div style="font-family: Arial, sans-serif; line-height: 1.6;">
                <h2>Reset Your Password</h2>

                <p>
                    We received a request to reset your PrepPilot AI password.
                </p>

                <p>
                    Click the button below to create a new password:
                </p>

                <a
                    href="${resetUrl}"
                    style="
                        display:inline-block;
                        padding:12px 20px;
                        background:#2563eb;
                        color:white;
                        text-decoration:none;
                        border-radius:6px;
                    "
                >
                    Reset Password
                </a>

                <p>
                    This link will expire in 15 minutes.
                </p>

                <p>
                    If you did not request a password reset, you can safely
                    ignore this email.
                </p>

                <p>
                    — PrepPilot AI
                </p>
            </div>
        `,
    });

    if (error) {
        console.error("Resend email error:", error);
        throw error;
    }

    console.log("Password reset email sent:", data?.id);

    return data;
};

module.exports = sendResetEmail;