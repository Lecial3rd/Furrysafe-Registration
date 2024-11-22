import supabase from "../config/database.js";
import multer from "multer"
import fs from "fs"
import paht from "path"
import dotenv from "dotenv"; //Added by salpocial
import nodemailer from "nodemailer"; // Added by salpocial

dotenv.config();

export const retrieveReportCategory = async (req, res) => {
    try {
        let { data, error } = await supabase.from('tbl_post_type').select('*');
        if (error) {
            console.error('Error fetching post types:', error);
        } else {
            console.log(data);
            return res.status(200).json(data);

        }
    }
    catch (err) {
        console.log(err)
    }
}

//Added by salpocial
const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 587, // Or 465 for secure SMTP
    secure: false, // True for 465, false for other ports
    auth: {
      user: 'furrysafe5@gmail.com', // Replace with your email
      pass: 'solj yosh gctq pypc', // Replace with your email password or App Password on Google
    },
    debug: true, // Log connection details
  });

  export const sendEmail = async (to, subject, text, html) => {
    const mailOptions = {
        from: 'furrysafe5@gmail.com',
        to: to,
        subject: subject,
        text: text,
        html: html     //HTML Body Optional
    };

    try {
        await transporter.sendMail(mailOptions);
        console.log('Email sent successfully');
    } catch (error) {
        console.error('Error sending email:', error);
    }
}; //End of added code