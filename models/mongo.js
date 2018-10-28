const moment = require('moment')
const mongoose = require('mongoose')
const marked = require('marked')
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

// 生成 User 用户的 Schema接口、和对应document构造函数
var UserSchema = new Schema({
  username: { type: String, required: true},
  password: { type: String, required: true },
  avatar: { type: String, required: true },
  gender: { type: String, enum: ['m', 'f', 'x'], default: 'x' },
  bio: { type: String, required: true },
  logindate : { type: String, default: new Date().getTime()}
}, {
  versionKey: false
})

var User = mongoose.model('User', UserSchema)

// 生成 POST 文章的 Schema接口、和对应document构造函数
var PostSchema = new Schema({
  author: { type: String, required: true},
  title: { type: String, required: true },
  content: { type: String, required: true },
  pv: { type: Number, default: 0 },
}, {
  versionKey: false
})

function contentToHtml (schema, options) {
  schema.post('find', function(result) {
    result.map(x => x.content = marked(x.content))
  })
  schema.post('findOne', function(res) {
    if (res) {
      res.content = marked(res.content)
    }
  })
}

PostSchema.plugin(contentToHtml)
const Post = mongoose.model('Post', PostSchema)

module.exports = {
  User,
  Post
}
