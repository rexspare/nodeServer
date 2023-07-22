const express = require('express')
const router = express.Router()
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')
const usersController = require('../../controllers/usersController')

router.route('/')
    .get(usersController.getAllUsers)
    .put(usersController.updateUser)
    .delete(usersController.deleteUser)

router.route('/:id')
    .get(usersController.getUserById)

router.route('/admin')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.adminUpdateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.adminDeleteUser)

module.exports = router