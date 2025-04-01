const nodemailer = require('nodemailer');

exports.send2FAEmail = async (email, token) => {
    try {
        // 1. Create transporter
        const transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS
        }
        });

        // 2. Email options
        const mailOptions = {
        from: `"Nodado Hospital Core" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: 'Your 2FA Verification Code',
        html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h2 style="color: #2563eb;">Your Verification Code</h2>
            <p>Use this code to complete your login:</p>
            <div style="background: #f3f4f6; padding: 20px; text-align: center; margin: 20px 0;">
                <h1 style="margin: 0; font-size: 24px; letter-spacing: 2px;">${token}</h1>
            </div>
            <p style="font-size: 12px; color: #6b7280;">
                This code expires in 15 minutes. If you didn't request this, please ignore this email.
            </p>
            </div>
        `
    };

    // 3. Send email
    await transporter.sendMail(mailOptions);
    console.log(`2FA email sent to ${email}`);
    
    } catch (error) {
        console.error('Email sending error:', error);
        throw new Error('Failed to send 2FA email');
    }
};