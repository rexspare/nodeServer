const User = require('../model/User')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

const handleLogin = async (req, res) => {
    const { user, pwd } = req.body
    if (!user || !pwd) return res.status(400).json({ 'message': 'Username and password is required!' })
    // check for username in DB
    const foundUser = await User.findOne({ username: user }).exec();
    if (!foundUser) return res.sendStatus(401); // Unauthorized
    // Evaluate Password
    const match = await bcrypt.compare(pwd, foundUser.password)
    if (match) {
        const roles = Object.values(foundUser.roles)
        // create JWTs
        const accessToken = jwt.sign(
            {
                "UserInfo": {
                    "username": foundUser.username,
                    "roles": roles
                }
            },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: '1h' }
        )
        const refreshToken = jwt.sign(
            { "username": foundUser.username },
            process.env.REFRESH_TOKEN_SECRET,
            { expiresIn: '1d' }
        )
        // SAVING REFRESH TOKEN WITH CURRENT USER
            foundUser.refreshToken = refreshToken
            const result = await foundUser.save();

        res.cookie('jwt', refreshToken, { httpOnly: true, sameSite: 'None', secure: true, maxAge: 24 * 60 * 60 * 1000 })
        res.json({ accessToken, refreshToken })
    } else {
        res.sendStatus(401);
    }
}

module.exports = { handleLogin }