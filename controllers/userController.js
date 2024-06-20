const User = require('../models/user');

const getProfile = async (req, res) => {
    try {
        const user = await User.findById(req.user._id);
        if (!user) {
            return res.status(404).send('User not found');
        }
        const expTable = [20, 50, 100, 300, 600, 1000];
        res.render('profile', { user, expTable, title: "Profile Page" });
    } catch (err) {
        res.status(500).send('Unable to get your profile');
    }
}

module.exports = {
    getProfile
};