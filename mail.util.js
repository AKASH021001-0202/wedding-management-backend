import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

const transport = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "akashbatech0202@gmail.com",
    pass: process.env.GMAIL_PASS || "",
  },
});

const mailOptions = {
    from :"akashbatech0202@gmail.com",
    to:["nakashn007@gmail.com"],
    subject: "Email test",
    text: "Test email for login",

};
export {transport ,mailOptions}