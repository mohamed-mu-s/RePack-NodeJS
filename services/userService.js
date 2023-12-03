const bcrypt = require('bcrypt')
const apiConstant = require('../utils/apiConstant');
const User = require('../models/UserModel');


module.exports = {
    signUp: async (req, res) => {
        try {
            let { name, email, password, dateOfBirth } = req.body;
            name = name.trim();
            email = email.trim();
            password = password.trim();
            dateOfBirth = dateOfBirth.trim();

            await validateInput(name, email, password, dateOfBirth);

            // Check if user already exists
            const existingUser = await User.findOne({ email });

            if (existingUser) {
                throw new Error('User with provided email already exists');
            }

            // Hash the password
            const saltRounds = 10;
            const hashPassword = await bcrypt.hash(password, saltRounds);

            // Create and save the new user
            const newUser = new User({
                name,
                email,
                password: hashPassword,
                dateOfBirth,
            });

            const result = await newUser.save();
            return result;
        } catch (err) {
            throw err;
        }
    },
    signIn: async (req, res) => {
        try {
            let { email, password } = req.body;
            email = email.trim();
            password = password.trim();

            if (email === '' || password === '') {
                throw new Error('Empty credentials supplied!');
            }

            // checking if user already exists
            const data = await User.findOne({ email }).lean({getters: true});

            if (data) {
                const hashPassword = data.password;
                const result = await bcrypt.compare(password, hashPassword);

                if (result) {
                    delete data.password;
                    return data; // Return the user data if the password is correct
                } else {
                    throw new Error('Invalid password entered!');
                }
            } else {
                throw new Error('Invalid credentials entered!');
            }
        } catch (err) {
            throw err;
        }
    }
}

async function validateInput(name, email, password, dateOfBirth) {
    if (!name || !email || !password || !dateOfBirth) {
        throw new Error('Empty input fields!');
    }

    if (!/^[a-zA-Z]*$/.test(name)) {
        throw new Error('Invalid name entered!');
    }

    if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
        throw new Error('Invalid email entered!');
    }

    if (password.length < 8) {
        throw new Error('Password is too short!');
    }
};
