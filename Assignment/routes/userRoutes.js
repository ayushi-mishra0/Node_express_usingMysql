const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController'); // Ensure this path is correct

// Define routes and associate them with controller functions
router.get('/users', userController.listUsers); 
router.get('/users/add', userController.addUserForm); 
router.post('/users/add', userController.addUser); 
router.get('/users/edit/:id', userController.editUserForm); 
router.post('/users/edit/:id', userController.editUser); // Ensure editUser is defined in userController
router.get('/users/delete/:id', userController.deleteUser); // Ensure deleteUser is defined in userController

module.exports = router;
