import supabase from "../config/database.js";
import multer from "multer"
import fs from "fs"
import paht from "path"

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