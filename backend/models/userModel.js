// TBL_USER TESTING INCLUDES CREATE, UPDATE, RETRIEVE, AND DEACTIVATE 
import db from "../config/database.js";

//get all users
export const getUsers = (result)=>{
    db.query ("SELECT * FROM tbl_user", (err,results)=>{
        if(err){
            console.log("ERROR: " + err);
            result(err, null)
        }
        else{
            result(null,results)
        }
    })
}

//get single user 
export const getUserbyUserID = (id, result)=>{
    db.query("SELECT * from tbl_user where user_id = ?", 
        [id],
        (err, results) => {
            if(err){
                console.log(err); 
                result(err,null); 
            }
            else{
                result(null,results[0]);
            }
        }
    )
}

// Insert user to database 
export const insertUser = (data, result) => {
    const { user_username, first_name, middle_initial, last_name, user_email, user_password, gender, date_of_birth } = data;

    // Insert into tbl_user
    db.query(`INSERT INTO tbl_user (user_email, user_password, date_created) VALUES (?, ?, NOW())`,
        [user_email, user_password], 
        (err, results) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    result('ER_DUP_ENTRY', null);
                } else {
                    console.log(err);
                    result(err, null);
                }
            } else {
                // Insert into tbl_user_details
                const user_id = results.insertId;
                db.query(`INSERT INTO tbl_user_details (user_id, user_username, firstname, mi, lastname, gender, date_of_birth) VALUES (?, ?, ?, ?, ?, ?, ?)`,
                    [user_id, user_username, first_name, middle_initial, last_name, gender, date_of_birth], 
                    (err, results) => {
                        if (err) {
                            console.log(err);
                            result(err, null);
                        } else {
                            result(null, results);
                            console.log("Successfully added");
                        }
                    }
                );
            }
        }
    );
};



//update user 
export const updateUserbyUserID = (data, id, result) => {
    db.query ("UPDATE tbl_user SET user_email = ? , user_password = ? WHERE user_id = ?", 
        [data.user_email, data.user_password, user_id],
        (err, results) => {
            if(err){
                console.log(err); 
                result (err,null);
            }else{
                result(null, results);
            }
        }
    )
}

//deactivate user 
export const deactivateUserbyUser_ID = (data, id, result) => {
    db.query ("UPDAET tbl_user SET active = ? WHERE user_id = ?",
        [data.active, data.user_id],
        (err,results) => {
            if(err){
                console.log(err);
                result (err, null);
            }
            else{
                result(null, results);
            }
        }
    )
}