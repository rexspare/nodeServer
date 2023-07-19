const User = require('../model/User')
const bcrypt = require('bcrypt')

const handleCreateUser = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password is required!' })
    // check for duplicate uername in DB
    const duplicate = await User.findOne({ username: user }).exec()
    if (duplicate) return res.sendStatus(409); // conflict

    try {
        // encrypt the password
        const hashedPwd = await bcrypt.hash(pwd, 10);
        // Create and store the new user
        const result = await User.create({
            "username": user,
            "password": hashedPwd
        });

        console.log('====================================');
        console.log(result);
        console.log('====================================');

        res.status(201).json({ 'message': `New user ${user} was created!` })
    } catch (error) {
        res.send(500).json({ 'message': error.message })
    }
}

module.exports = { handleCreateUser }