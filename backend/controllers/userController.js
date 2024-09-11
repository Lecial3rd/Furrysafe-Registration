//import functions from models 
import {
    getUserbyUserID, //individual user
    getUsers, 
    insertUser, 
    updateUserbyUserID,
    deactivateUserbyUser_ID,
} from "../models/userModel.js" 

//retrieves all users
export const showUsers = (req, res)=> {
    getUsers((err, results) => {
        if(err){
            res.send(err);
        }
        else{
            res.json(results);
        }
    })
};

//retrieves a single user 
export const showUserbyUserID = (req, res) => {
     getUserbyUserID (req.params.id, (err, results) => {
        if(err){
            res.send(err); 
        }
        else{
            res.json(results);
        }
     })
}

//create new user 
export const createUser = (req, res) => {
    const data = req.body; 
    insertUser (data, (err, results)=>{
        if(err){
            if(err == 'ER_DUP_ENTRY'){
                res.status(409).send({error: 'ER_DUP_ENTRY'});
            }
            else{
                res.send(err);
            }
        }
        else{
            res.json(results);
        }
    })
}

//update user 
export const updateUser = (req, res) => {
    const data = req.body;
    const id = req.params.id;
    updateUserbyUserID(data, id, (err, results) => {
        if(err){
            res.send("Error: " + err);
        }
        else{
            res.json(results);
        }
    })
}

//deactivate user 
export const deactivateUser = (req, res) => {
    const data = req.body; 
    const id = req.params.id; 

    deactivateUserbyUser_ID(data, id, (err, results) => {
        if(err){
            res.send("Error:" + err); 
        }
        else{
            res.json(results);
        }
    })
}