const nodemailer = require('nodemailer');
const fs = require("fs");
const dotenv = require("dotenv");
const path = require("path");
dotenv.config();

const { EMAIL_USER, EMAIL_PASS } = process.env;

console.log("EMAIL_USER:", process.env.EMAIL_USER);
console.log("EMAIL_PASS:", process.env.EMAIL_PASS);
function replaceContent(content, creds) {
    let allkeysArr = Object.keys(creds);
    allkeysArr.forEach(function (key) {
        content = content.replace(`#{${key}}`, creds[key]);
    })

    return content;
}

async function EmailHelper(templateName, receiverEmail, creds) {
    try {
        const templatePath = path.join(__dirname, "email_templates", templateName);
        let content = await fs.promises.readFile(templatePath, "utf-8");
        const emailDetails = {
            to: receiverEmail,
            from: EMAIL_USER, 
            subject: 'RESET OTP',
            text: `Hi ${creds.name} this is your reset OTP: ${creds.otp}`,
            html: replaceContent(content, creds),
        }

        const transportDetails = {
            host: 'smtp.gmail.com',  // Use Gmail's SMTP server
            port: 587,
            secure: false, // true for 465, false for other ports
            auth: {
                user: EMAIL_USER,
                pass: EMAIL_PASS
            }
        }

        const transporter = nodemailer.createTransport(transportDetails);
        await transporter.sendMail(emailDetails);
        console.log("Email sent successfully");
    } catch (err) {
        console.error("Error sending email:", err);
        throw err; // Re-throw the error so it can be handled by the calling function
    }
}

module.exports = EmailHelper;