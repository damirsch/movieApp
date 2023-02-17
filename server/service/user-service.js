const UserModel = require('../models/user-model.js')
const bcrypt = require('bcrypt')
const tokenService = require('./token-service.js')
const UserDto = require('../dtos/user-dto.js')
const ApiError = require('../exceptions/api-error')
const fileService = require('./file-service.js')

async function generateTokenAndSaveUser(user){
  const userDto = new UserDto(user)
  const tokens = tokenService.generateTokens({...userDto})
  await tokenService.saveToken(userDto.id, tokens.refreshToken)
  return {...tokens, user: userDto}
}

class UserService{
  async registration(username, email, password){
    const candidate = await UserModel.findOne({email})
    if(candidate){
      throw ApiError.BadRequest('Пользователь с данным email уже зарегистрирован')
    }
    const hashPassword = await bcrypt.hash(password, 3)
    const user = await UserModel.create({username, email, password: hashPassword})
    return generateTokenAndSaveUser(user)
  }


  async login(email, password){
    const user = await UserModel.findOne({email})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }
    const isPassEquals = await bcrypt.compare(password, user.password)
    if(!isPassEquals){
      throw ApiError.BadRequest('Неверный пароль')
    }
    return generateTokenAndSaveUser(user)
  }


  async logout(refreshToken){
    const token = await tokenService.removeToken(refreshToken)
    return token
  }


  async refresh(refreshToken){
    if(!refreshToken){
      throw ApiError.UnauthorizedError()
    }
    const userData = tokenService.validateRefreshToken(refreshToken)
    const tokenFromDb = tokenService.findToken(refreshToken)
    if(!userData || !tokenFromDb){
      throw ApiError.UnauthorizedError()
    }
    const user = await UserModel.findById(userData.id)
    return generateTokenAndSaveUser(user)
  }


  async changeUsername(username, newUsername){
    await UserModel.updateOne({username}, {$set: {username: newUsername}})
    const user = await UserModel.findOne({username: newUsername})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким именем не найден')
    }
    return generateTokenAndSaveUser(user)
  }


  async changeEmail(email, newEmail){
    await UserModel.updateOne({email}, {$set: {email: newEmail}})
    const user = await UserModel.findOne({email: newEmail})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }
    return generateTokenAndSaveUser(user)
  }


  async addProfilePicture(email, picture){
    const candidate = await UserModel.findOne({email})
    const fileName = fileService.saveFile(picture)
    if(candidate.picture){
      fileService.removeFile(candidate.picture)
    }
    await UserModel.updateOne({email}, {$set: {picture: fileName}})
    const user = await UserModel.findOne({email})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким email не найден')
    }
    return generateTokenAndSaveUser(user)
  }
  
  async getUserPicture(username){
    const user = await UserModel.findOne({username})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким именем не найден')
    }
    return user.picture
  }
  
  async addUserFavFilm(email, filmId, filmPicturelink, filmTitle){
    const user = await UserModel.updateOne({email}, {$addToSet: {favouriteFilms: {
      filmId,
      filmPictureLink: filmPicturelink,
      filmTitle: filmTitle
    }}})
    return user.favouriteFilms
  }
  
  async getUserFavFilms(username){
    const user = await UserModel.findOne({username})
    if(!user){
      throw ApiError.BadRequest('Пользователь с таким именем не найден')
    }
    return user.favouriteFilms
  }
  
  async removeUserFavFilm(email, filmId){
    const user = await UserModel.updateOne({email}, {$pull: {favouriteFilms: {filmId}}})
    return user.favouriteFilms
  }

  async removeAllUserFavFilms(email){
    const user = await UserModel.updateOne({email}, {$pull: {favouriteFilms: {}}})
    console.log(user);
    return user.favouriteFilms
  }
  
  async getUsers(){
    const users = await UserModel.find()
    return users
  }

  async getUser(username){
    const user = await UserModel.findOne({username})
    return {username: user.username, picture: user.picture, id: user._id}
  }
}

module.exports = new UserService()