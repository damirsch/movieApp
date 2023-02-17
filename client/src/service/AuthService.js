import $api from "../http";

export default class AuthService{
  static registration(username, email, password){
    return $api.post('/registration', {username, email, password})
  }
  
  static login(email, password){
    return $api.post('/login', {email, password})
  }

  static logout(){
    return $api.post('/logout')
  }

  static changeUsername(username, newUsername){
    return $api.post('/change-username', {username, newUsername})
  }

  static changeEmail(email, newEmail){
    return $api.post('/change-email', {email, newEmail})
  }
}

