const router = require('express').Router()
const authMiddleware = require('../middleware/authMiddleware')
const adminMiddleware = require('../middleware/adminMiddleware')
const userController = require('../controllers/userController')

router.get('/', [authMiddleware, adminMiddleware], userController.listAllUsers)

router.get('/me', authMiddleware, userController.loginUserInfos)

router.patch('/me', authMiddleware, userController.loginUserUpdate)

router.post('/', userController.createNewUser)

router.post('/login', userController.login)

router.patch('/:id', userController.adminUserUpdate)

router.get('/deleteAll', [authMiddleware, adminMiddleware], userController.adminDeleteAll)

router.delete('/me', authMiddleware, userController.userDelete)

router.delete('/:id', [authMiddleware, adminMiddleware], userController.adminDeleteById)

module.exports = router