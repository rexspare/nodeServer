const express = require('express')
const router = express.Router()
const verifyRoles = require('../../middleware/verifyRoles')
const ROLES_LIST = require('../../config/roles_list')
const usersController = require('../../controllers/usersController')

router.route('/')
    .get(usersController.getAllUsers)
    .put(usersController.updateUser)
    .delete(usersController.getAllUsers)

router.route('/:id')
    .get(usersController.getUserById)

router.route('/admin')
    .put(verifyRoles(ROLES_LIST.Admin, ROLES_LIST.Editor), usersController.updateUser)
    .delete(verifyRoles(ROLES_LIST.Admin), usersController.getAllUsers)

module.exports = router