const jwt = require('jsonwebtoken');
const apiConstant = require('./apiConstant');
const appConstant = require('./appConstant');

module.exports = {
    jwtSign: (formObj) => {
        return jwt.sign(formObj, apiConstant.SECRET_KEY)  
    },
    // Middleware to verify the token and check user role
    authenticateToken: (req, res, next) => {
        const url = req.originalUrl.split(appConstant.PREFIX_URL);
        if (['/user/signin', '/user/signup'].find(item => item === url[1])) {
            return next();
        } else {
            const token = req.header('Authorization');
            if (!token || !token.startsWith('Bearer ')) {
                return res.status(401).json({ error: true, message: "Unauthorized User!" }); // Unauthorized
            }
            const accessToken = token.split(' ')[1];
            jwt.verify(accessToken, apiConstant.SECRET_KEY, (err, user) => {
                if (err) return res.sendStatus(403);
                req.user = user;
                return next();
            });
        }
    }
}