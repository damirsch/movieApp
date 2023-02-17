const mongoose = require('mongoose')

const UserSchema = new mongoose.Schema({
  username: {type: String, unique: true, required: true},
  email: {type: String, unique: true, required: true},
  password: {type: String, required: true},
  picture: {type: String, default: 'account.svg'},
  favouriteFilms: {type: Array, default: []},
})

module.exports = mongoose.model('User', UserSchema)