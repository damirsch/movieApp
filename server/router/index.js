const Router = require('express').Router
const userController = require('../controllers/user-controller.js')
const { body } = require('express-validator')
const authMiddleWare = require('../middlewares/auth-middleware')

const router = new Router()

router.post('/registration',
  body('username').isLength({min: 4, max: 20}),
  body('email').isEmail(),
  body('password').isLength({min: 8, max: 32}),
  userController.registration)
router.post('/login', userController.login)
router.post('/logout', userController.logout)
router.post('/change-username',
  body('newUsername').isLength({min: 4, max: 20}),
  userController.changeUsername)
router.post('/change-email',
  body('newEmail').isEmail(),
  userController.changeEmail)
router.get('/refresh', userController.refresh)
router.get('/user/:username', userController.getUser)
router.get('/users', authMiddleWare, userController.getUsers)
router.post('/add-profile-picture', authMiddleWare, userController.addProfilePicture)
router.get('/user-picture/:username', userController.getUserPicture)
router.get('/user-fav-films/:username', userController.getUserFavFilms)
router.post('/add-user-fav-film', authMiddleWare, userController.addUserFavFilm)
router.post('/remove-user-fav-film', authMiddleWare, userController.removeUserFavFilm)
router.post('/remove-all-user-fav-films', authMiddleWare, userController.removeAllUserFavFilms)

module.exports = router