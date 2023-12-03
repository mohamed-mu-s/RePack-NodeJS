const bcrypt = require('bcrypt')
const logger = require('../utils/logger');
const apiConstant = require('../utils/apiConstant');
const User = require('../models/UserModel');
const userService = require('../services/userService');

module.exports = {
    signUp: async (req, res) => {
        try {
            const result = await userService.signUp(req, res);
            return res.status(apiConstant.OK).json({
                status: apiConstant.SUCCESS,
                message: 'Signup successful',
                items: result
            })
        } catch (err) {
            logger.error(err.message);
            return res.status(apiConstant.ERROR).send({
                error: true,
                status: apiConstant.FAILED,
                message: err.message
            })
        }
    },
    signIn: async (req, res) => {
        try {
            const result = await userService.signIn(req, res);
            return res.status(apiConstant.OK).json({
                status: apiConstant.SUCCESS,
                message: 'Sign-In successful',
                items: result // Access the 'data' property in the result
            });
        } catch (err) {
            logger.error(err.message);
            return res.status(apiConstant.ERROR).send({
                error: true,
                status: apiConstant.FAILED,
                message: err.message
            });
        }
    }
}