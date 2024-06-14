const express = require('express');
const bodyParser = require('body-parser');
const validator = require('validator');
const cors = require('cors');
const fs = require('fs');
const path = require('path');
const flash = require("connect-flash");
const session = require('express-session');

const app = express();
const port = 3000;

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

app.use(express.urlencoded({ extended: true }));
app.use(cors({ origin: "http://127.0.0.1:5500" }));
app.use(express.static("public"));

app.use(session({
    secret: 'dracuzi loves to write code',
    resave: false,
    saveUninitialized: true
}));
app.use(flash());

app.use((req, res, next) => {
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

app.get('/', (req, res) => {
    res.render("pages/home");
});

app.post('/', (req, res) => {
    const { firstName, lastName, email, password } = req.body;
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

    if (errors.length > 0) {
        req.flash('error', errors);
        return res.redirect('/');
    }

    fs.readFile('users.json', 'utf-8', (err, data) => {
        if (err && err.code !== 'ENOENT') {
            req.flash('error', 'Failed to read data file');
            return res.redirect('/');
        }

        const usersData = data ? JSON.parse(data) : [];

        const emailExists = usersData.some(user => user.email === email.trim());
        if (emailExists) {
            req.flash('error', 'Email already exists');
            return res.redirect('/');
        }

        usersData.push({
            firstName: firstName.trim(),
            lastName: lastName.trim(),
            email: email.trim(),
            password: password.trim()
        });

        fs.writeFile('users.json', JSON.stringify(usersData, null, 2), 'utf-8', (err) => {
            if (err) {
                req.flash('error', 'Failed to write data file');
                return res.redirect('/');
            }

            req.flash('success', 'User registered successfully');
            return res.redirect('/');
        });
    });
});

app.listen(port, () => {
    console.log("Server is running on port " + port);
});
