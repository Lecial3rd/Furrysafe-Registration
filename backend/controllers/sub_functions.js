// sub_functions.js
import {
    retrieveReportCategory,
    sendEmail
} from '../model/subModel.js';

export const getReportCategory = (req, res) => {
    retrieveReportCategory(req, res);
};

//Added by Salpocial
export const sendMail = async (to, subject, text, html) => {
    try {
        await sendEmail(to, subject, text, html);
    } catch (error) {
        console.error('Error in sendMail:', error);
    }
};