import express from "express";

import {
    showUserbyUserID,
    showUsers, 
    createUser, 
    updateUser, 
    deactivateUser
} from "../controllers/userController.js";

const router = express.Router();

// get all users
router.get("/user", showUsers);

// get single user 
router.get("/user/:id", showUserbyUserID);

// create user 
router.post('/register', createUser);

// update user
router.put("/user/:id", updateUser);

// deactivate user 
router.put("/user/:id/deactivate", deactivateUser); // corrected the URL to avoid conflict with update

export default router;
