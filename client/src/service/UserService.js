import $api from "../http";

export default class UserService{
  static getUserPicture(username){
    return $api.get(`/user-picture/${username}`)
  }

  static getUsers(){
    return $api.get('/users') 
  }

  static getUser(username){
    return $api.get(`/user/${username}`)
  }

  static addPicture(formData){
    return $api.post(`/add-profile-picture`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })
  }

  static addUserFavFilm(email, filmId, filmPicturelink, filmTitle){
    return $api.post(`/add-user-fav-film`, {email, filmId, filmPicturelink, filmTitle})
  }

  static removeUserFavFilm(email, filmId){
    return $api.post(`/remove-user-fav-film`, {email, filmId})
  }

  static removeAllUserFavFilms(email){
    return $api.post(`/remove-all-user-fav-films`, {email})
  }

  static getUserFavFilms(username){
    return $api.get(`/user-fav-films/${username}`)
  }
}