const User = require('../models/userModel'); // Import the User model
const multer = require('multer');
const path = require('path');
const moment = require('moment');
const fs = require('fs');

// Ensure 'uploads' directory exists
const uploadDir = 'uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Setup multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir); // where to store this file like in which folder
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); /*appending our file with the current date so that 
                                                            whenever someone uploads the file with the same name it doesn't crashes*/
    }
});

const upload = multer({ storage: storage });

exports.listUsers = (req, res) => {
    User.getAllUsers((err, results) => {
        if (err) {
            console.error('Error retrieving users:', err);
            return res.status(500).send('Error retrieving users: ' + err.message);
        }

        // Convert date format for display
        results.forEach(user => {
            if (user.dob) {
                user.dob = moment(user.dob).format('YYYY-MM-DD');
            }
        });

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
        const profileImage = req.file ? `uploads/${req.file.filename}` : null;

        const formattedDob = dob ? moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;

        console.log('Uploaded file details:', req.file); 

        const newUser = {
            name,
            email,
            phone,
            dob: formattedDob,
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

    User.getUserById(userId, (err, user) => {
        if (err) {
            console.error('Error fetching user:', err);
            return res.status(500).send('Error fetching user: ' + err.message);
        }
        if (!user) {
            return res.status(404).send('User not found');
        }

        if (user.dob) {
            user.dob = moment(user.dob).format('YYYY-MM-DD');
        }

        console.log('Formatted DOB:', user.dob); 
        res.render('editUser', { user });
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
        const profileImage = req.file ? `uploads/${req.file.filename}` : null;

        const formattedDob = dob ? moment(dob, 'YYYY-MM-DD').format('YYYY-MM-DD') : null;

        const updatedUser = {
            name,
            email,
            phone,
            dob: formattedDob,
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
