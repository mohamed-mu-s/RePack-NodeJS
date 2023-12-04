const express = require("express");
const router = express.Router();

// Protected route for admin
router.get('/admin', (req, res) => {
    if (req.user.role.find(item => item != 'Admin')) return res.sendStatus(403);
    res.json({ message: 'Admin access granted' });
});

// Protected route for user
router.get('/client', (req, res) => {
    res.json({ message: 'User access granted' });
});

router.use("/user", require('./userRouter'));

module.exports = router;