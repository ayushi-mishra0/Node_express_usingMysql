const mysql = require('mysql2');

const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'root',
    database: 'my_database'
});

connection.connect((err) => {
    if (err) throw err;
    console.log('Connected to the database.');

    // Create table if it does not exist
    const createTableQuery = `
        CREATE TABLE IF NOT EXISTS users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL UNIQUE,
            phone VARCHAR(20),
            dob DATE,
            profileImage VARCHAR(255),
            address TEXT
        );
    `;
    
    connection.query(createTableQuery, (err, results) => {
        if (err) {
            console.error('Error creating table:', err.stack);
            return;
        }
        console.log('Users table created or already exists.');
    });
});

module.exports = connection;
