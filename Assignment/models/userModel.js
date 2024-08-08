const db = require('../config/db');

const User = {
    addUser: (user, callback) => {
        const { name, email, phone, dob, profileImage, address } = user;
        const query = `
            INSERT INTO users (name, email, phone, dob, profileImage, address)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        db.query(query, [name, email, phone, dob, profileImage, address], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getAllUsers: (callback) => {
        db.query('SELECT * FROM users', (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    getUserById: (userId, callback) => {
        const query = 'SELECT * FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results[0]); // Ensure you return a single user object
        });
    },
    updateUser: (userId, user, callback) => {
        const { name, email, phone, dob, profileImage, address } = user;
        const query = `
            UPDATE users
            SET name = ?, email = ?, phone = ?, dob = ?, profileImage = ?, address = ?
            WHERE id = ?
        `;
        db.query(query, [name, email, phone, dob, profileImage, address, userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    },
    deleteUser: (userId, callback) => {
        const query = 'DELETE FROM users WHERE id = ?';
        db.query(query, [userId], (err, results) => {
            if (err) return callback(err);
            callback(null, results);
        });
    }
};

module.exports = User;
