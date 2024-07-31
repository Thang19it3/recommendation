const nodemailer = require('nodemailer');
const asyncHandler = require('express-async-handler');

const sendEmail = asyncHandler(async (data, req, res) =>{
    let transporter = nodemailer.createTransport({
        host: "smtp.gmail.com",
        post: 587,
        secure: false,
        auth: {
            user: process.env.MAIL_ID,
            pass: process.env.MP,
        },
    });

    let info = await transporter.sendMail({
        from: "Hey",
        to: data.to,
        subject: data.subject,
        text: data.text,
        html: data.htm,
    });
    
});

module.exports = sendEmail;