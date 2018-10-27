const moment = require('moment')
const mongoose = require('mongoose')
const Schema = mongoose.Schema

const url = require('../config/default').mongodb

// 连接mongoDB
mongoose.connect(url, {
  useNewUrlParser: true
})

// mongoose.connection.close()

// 监控mongoose连接
mongoose.connection.on('connected', function() {
  console.log('Mongoose connection open to ' + url)
})

mongoose.connection.on('error',function(err) {
  console.log('Mongoose connection error: ' + err)
})

mongoose.connection.on('disconnected', function () {
  console.log('Mongoose connection disconnected')
})

// 生成Schema接口、和对应document构造函数
var UserSchema = new Schema({
  username: { type: 'string', required: true},
  password: { type: 'string', required: true },
  avatar: { type: 'string', required: true },
  gender: { type: 'string', enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: 'string', required: true },
  logindate : { type: 'string', default: new Date().getTime()}
}, {
  versionKey: false
})

var User = mongoose.model('User', UserSchema)

module.exports = {
  User
}
