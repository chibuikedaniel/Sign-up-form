const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');
const cors = require("cors");
const fs = require('fs');

const app = express();
const port = 3000;
const url = "http://127.0.0.1:5500/index.html";

// Parse request body
app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: ["http://127.0.0.1:5500/index.html"] }));
app.use(express.static("public"));


// Serve the sign-up page
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});

// Handle form submission
app.post('/', (req, res) => {
    const { firstName, lastName, email, password } = req.body;

    // Validate user input
    const errors = [];

    if (!firstName || !validator.isLength(firstName.trim(), { min: 1 })) {
        errors.push('First name is required');
    }

    if (!lastName || !validator.isLength(lastName.trim(), { min: 1 })) {
        errors.push('Last name is required');
    }

    if (!email || !validator.isEmail(email.trim())) {
        errors.push('Invalid email address');
    }

    if (!password || !validator.isStrongPassword(password.trim())) {
        errors.push('Password must be at least 8 characters long and contain at least one uppercase letter, one lowercase letter, one number, and one special character');
    }

    // If there are errors, send them back to the client
    if (errors.length > 0) {
        res.status(400).json({ errors });
        return;
    }

    // Read the existing user data from the JSON file
    fs.readFile('users.json', 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            return res.status(500).json({ error: 'Failed to read data file' });
        }

        const usersData = data ? JSON.parse(data) : [];

        // Check if the email already exists
        const emailExists = usersData.some(user => user.email === email.trim());
        if (emailExists) {
            res.status(400).json({ errors: ['Email already exists'] });
            return;
        }

        // Add the new user data to the array
        usersData.push({ firstName: firstName.trim(), lastName: lastName.trim(), email: email.trim(), password: password.trim() });

        // Write the updated user data back to the JSON file
        fs.writeFile('users.json', JSON.stringify(usersData, null, 2), 'utf-8', (err) => {
            if (err) {
                return res.status(500).json({ error: 'Failed to write data file' });
            }

            // res.status(200).json({ message: 'Sign up successful' });
            res.redirect("/"); // Redirect after successful sign-up
        });
    });
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});