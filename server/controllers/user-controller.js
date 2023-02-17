const userService = require('../service/user-service.js')
const { validationResult } = require('express-validator')
const ApiError = require('../exceptions/api-error.js')

class UserController{
  async registration(req, res, next){
    try{
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }
      const {username, email, password} = req.body
      const userData = await userService.registration(username, email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e){
      next(e)
    }
  }

  async login(req, res, next){
    try{
      const {email, password} = req.body
      const userData = await userService.login(email, password)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e){
      next(e)
    }
  }

  async logout(req, res, next){
    try{
      const {refreshToken} = req.cookies
      const token = await userService.logout(refreshToken)
      res.clearCookie('refreshToken')
      return res.json(token)
    }catch(e){
      next(e)
    }
  }

  async refresh(req, res, next){
    try{
      const {refreshToken} = req.cookies
      const userData = await userService.refresh(refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e){
      next(e)
    }
  }

  async changeUsername(req, res, next){
    try{
      const {refreshToken} = req.cookies
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }
      const {username, newUsername} = req.body
      const userData = await userService.changeUsername(username, newUsername, refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e){
      next(e)
    }
  }

  async changeEmail(req, res, next){
    try{
      const {refreshToken} = req.cookies
      const errors = validationResult(req)
      if(!errors.isEmpty()){
        return next(ApiError.BadRequest('Ошибка валидации', errors.array()))
      }
      const {email, newEmail} = req.body
      const userData = await userService.changeEmail(email, newEmail, refreshToken)
      res.cookie('refreshToken', userData.refreshToken, {maxAge: 30 * 24 * 60 * 1000, httpOnly: true})
      return res.json(userData)
    }catch(e){
      next(e)
    }
  }

  async getUsers(req, res, next){
    try{
      const users = await userService.getUsers()
      return res.json(users)
    }catch(e){
      next(e)
    }
  }

  async getUser(req, res, next){
    try{
      const {username} = await req.params
      const user = await userService.getUser(username)
      return res.json(user)
    }catch(e){
      next(e)
    }
  }

  async addProfilePicture(req, res, next){
    try{
      const picture = req.files.file
      const {email} = req.body
      const user = await userService.addProfilePicture(email, picture)
      return res.json(user)
    }catch(e){
      next(e)
    }
  }

  async getUserPicture(req, res, next){
    try{
      const username = req.params.username
      const picture = await userService.getUserPicture(username)
      return res.json(picture)
    }catch(e){
      next(e)
    }
  }

  async addUserFavFilm(req, res, next){
    try{
      const {email, filmId, filmPicturelink, filmTitle} = req.body
      const films = await userService.addUserFavFilm(email, filmId, filmPicturelink, filmTitle)
      return res.json(films)
    }catch(e){
      next(e)
    }
  }

  async removeUserFavFilm(req, res, next){
    try{
      const {email, filmId} = req.body
      const films = await userService.removeUserFavFilm(email, filmId)
      return res.json(films)
    }catch(e){
      next(e)
    }
  }

  async removeAllUserFavFilms(req, res, next){
    try{
      const {email} = req.body
      const films = await userService.removeAllUserFavFilms(email)
      return res.json(films)
    }catch(e){
      next(e)
    }
  }

  async getUserFavFilms(req, res, next){
    try{
      const username = req.params.username
      const films = await userService.getUserFavFilms(username)
      return res.json(films)
    }catch(e){
      next(e)
    }
  }
}

module.exports = new UserController()