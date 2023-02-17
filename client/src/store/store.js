import AuthService from '../service/AuthService'
import axios from 'axios'
import { API_URL } from '../http'
import UserService from '../service/UserService'

export default class Store{
  user = {}
  users = {}
  error = {}
  isAuth = false

  setAuth(bool){
    this.isAuth = bool
  }
  
  setError(err){
    this.error = err
  }

  setUser(user){
    this.user = user
  }

  async registration(username, email, password){
    try{
      const response = await AuthService.registration(username, email, password)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      this.setError(false)
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async login(email, password){
    try{
      const response = await AuthService.login(email, password)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      this.setError(false)
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async logout(){
    try{
      await AuthService.logout()
      localStorage.removeItem('token')
      this.setAuth(false)
      this.setUser({})
      this.setError(false)
    }catch(e){
      this.setError(e)
    }
  }

  async changeUsername(username, newUsername){
    try{
      const response = await AuthService.changeUsername(username, newUsername)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      this.setError(false)
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async changeEmail(email, newEmail){
    try{
      const response = await AuthService.changeEmail(email, newEmail)
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      this.setError(false)
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async checkAuth(){
    try{
      const response = await axios.get(`${API_URL}/refresh`, {withCredentials: true})
      localStorage.setItem('token', response.data.accessToken)
      this.setAuth(true)
      this.setUser(response.data.user)
      this.setError(false)
    }catch(e){
      this.setError(e)
    }
  }

  async getUsers(){
    try{
      const response = await UserService.getUsers()
      this.users = response.data
      this.setError(false)
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async getUser(username){
    try{
      const response = await UserService.getUser(username)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async addPicture(formData){
    try{
      const response = await UserService.addPicture(formData)
      this.setUser(response.data.user)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async getUserPicture(username){
    try{
      const response = await UserService.getUserPicture(username)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async addUserFavFilm(email, filmId, filmPicturelink, filmTitle){
    try{
      const response = await UserService.addUserFavFilm(email, filmId, filmPicturelink, filmTitle)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async removeUserFavFilm(email, filmId){
    try{
      const response = await UserService.removeUserFavFilm(email, filmId)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async removeAllUserFavFilms(email){
    try{
      const response = await UserService.removeAllUserFavFilms(email)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }

  async getUserFavFilms(username){
    try{
      const response = await UserService.getUserFavFilms(username)
      this.setError(false)
      return response.data
    }catch(e){
      this.setError(e)
      throw new Error(e)
    }
  }
}