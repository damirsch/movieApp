module.exports = class UserDto{
  username
  email
  picture
  id

  constructor(model){
    this.username = model.username
    this.email = model.email
    this.id = model._id
    this.picture = model.picture
  }
}