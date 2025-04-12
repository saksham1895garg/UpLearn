import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp-relay.brevo.com',
    port: 587,
    auth: {
        user: process.env.SMTP_HOST,
        pass: process.env.SMPT_PASS,
    }
});
export default transporter;