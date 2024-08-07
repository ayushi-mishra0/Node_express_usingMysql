const User = require('../models/userModel'); // Import the User model
const multer = require('multer');
const path = require('path');

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadPath = 'uploads/';
        cb(null, uploadPath); // Ensure 'uploads/' exists
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); // Filename format
    }
});

const upload = multer({ storage: storage });

exports.listUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).send('Error retrieving users: ' + err.message);
        }
        res.render('listUsers', { users: results });
    });
};

exports.addUserForm = (req, res) => {
    res.render('addUser');
};

exports.addUser = (req, res) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).send('Error uploading file: ' + err.message);
        }

        const { name, email, phone, dob, address } = req.body;
        const profileImage = req.file ? req.file.path : null;

        console.log('Uploaded file details:', req.file); // Log file details for debugging

        const newUser = {
            name,
            email,
            phone,
            dob,
            profileImage,
            address
        };

        User.addUser(newUser, (err, result) => {
            if (err) {
                console.error('Error adding user:', err);
                return res.status(500).send('Error adding user: ' + err.message);
            }
            res.redirect('/users');
        });
    });
};

exports.editUserForm = (req, res) => {
    const userId = req.params.id;

    User.getUserById(userId, (err, results) => {
        if (err) {
            console.error('Error retrieving user:', err);
            return res.status(500).send('Error retrieving user: ' + err.message);
        }
        if (results.length === 0) {
            return res.status(404).send('User not found');
        }
        res.render('editUser', { user: results[0] });
    });
};

exports.editUser = (req, res) => {
    upload.single('profileImage')(req, res, (err) => {
        if (err) {
            console.error('Error during file upload:', err);
            return res.status(500).send('Error uploading file: ' + err.message);
        }

        const userId = req.params.id;
        const { name, email, phone, dob, address } = req.body;
        const profileImage = req.file ? req.file.path : null;

        const updatedUser = {
            name,
            email,
            phone,
            dob,
            profileImage,
            address
        };

        User.updateUser(userId, updatedUser, (err, result) => {
            if (err) {
                console.error('Error updating user:', err);
                return res.status(500).send('Error updating user: ' + err.message);
            }
            res.redirect('/users');
        });
    });
};

exports.deleteUser = (req, res) => {
    const userId = req.params.id;

    User.deleteUser(userId, (err, result) => {
        if (err) {
            console.error('Error deleting user:', err);
            return res.status(500).send('Error deleting user: ' + err.message);
        }
        res.redirect('/users');
    });
};
