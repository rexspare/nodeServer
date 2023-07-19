const { json } = require('express');
const User = require('../model/User');

const getAllUsers = async (req, res) => {
    const users = await User.find();
    res.json(users)
}

const getUserById = async (req, res) => {
    if (!req?.params?.id) return res.status(400).json({ "message": "id is required" })

    const user = await User.findOne({ _id: req.params.id })
    if (!user) return res.status(204).json({ "message": `No User Found wit ID ${req.params.id}` })
    res.json(user)
}

const deleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": "id is required" })

    const user = await User.findOne({ _id: req.body.id })
    if (!user) return res.status(204).json({ "message": `No User Found wit ID ${req.body.id}` })

    if (user.username !== req.user) return res.status(401).json({ "message": `You cannot Delete other Users Data` })

    const result = await user.deleteOne({ _id: req.body.id })
    res.json(result)
}

const adminDeleteUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": "id is required" })

    const user = await User.findOne({ _id: req.body.id })
    if (!user) return res.status(204).json({ "message": `No User Found wit ID ${req.body.id}` })

    const result = await user.deleteOne({ _id: req.body.id })
    res.json(result)
}

const updateUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": "id is required" })

    const user = await User.findOne({ _id: req.body.id })
    if (!user) return res.status(204).json({ "message": `No User Found wit ID ${req.body.id}` })

    if (user.username !== req.user) return res.status(401).json({ "message": `You cannot change other Users Data` })

    if (req?.body?.firstname) user.firstname = req.body.firstname
    if (req?.body?.lastname) user.lastname = req.body.lastname

    const result = await user.save();
    res.json(result)
}

const adminUpdateUser = async (req, res) => {
    if (!req?.body?.id) return res.status(400).json({ "message": "id is required" })

    const user = await User.findOne({ _id: req.body.id })
    if (!user) return res.status(204).json({ "message": `No User Found wit ID ${req.body.id}` })

    if (req?.body?.firstname) user.firstname = req.body.firstname
    if (req?.body?.lastname) user.lastname = req.body.lastname

    const result = await user.save();
    res.json(result)
}

module.exports = {
    getAllUsers,
    getUserById,
    deleteUser,
    adminDeleteUser,
    updateUser,
    adminUpdateUser
}