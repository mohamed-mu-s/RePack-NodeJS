const bcrypt = require('bcrypt');
const User = require('../models/UserModel');
const sessionUtil = require('../utils/sessionUtil');

module.exports = {
    signUp: async (req, res) => {
        try {
            let { name, email, password, dateOfBirth, role } = req.body;
            name = name.trim();
            email = email.trim();
            password = password.trim();
            dateOfBirth = dateOfBirth.trim();

            await validateInput(name, email, password, dateOfBirth, role);

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
                role,
                password: hashPassword,
                dateOfBirth
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
            const user = await User.findOne({ email }).lean({ getters: true });

            if (user) {
                const hashPassword = user.password;
                const result = await bcrypt.compare(password, hashPassword);

                if (result) {
                    delete user.password;
                    const token = sessionUtil.jwtSign({ userId: user._id, name: user.name, role: user.role, email: user.email });
                    return {...user, token}; // Return the user data if the password is correct
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

async function validateInput(name, email, password, dateOfBirth, role) {
    if (!name || !email || !password || !dateOfBirth || (!role && !role?.length > 0)) {
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
