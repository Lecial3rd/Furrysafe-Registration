// routes/userRoutes.js
const express = require('express');
const { getAllUsersExceptCurrent } = require('../controllers/userController');

const router = express.Router();

router.get('/:userId', getAllUsersExceptCurrent);

module.exports = router;
