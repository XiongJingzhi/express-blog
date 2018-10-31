const User = require('./mongo').User

module.exports = {
  // 注册用户，返回promise
  create: function(user) {
    user = new User(user)
    return User.create(user)
  },
  // 获取用户信息，返回promise
  getUserByName: function(name) {
    return User.findOne({username: name}).exec()
  },
  deleteMany: function(query) {
    return User.deleteMany(query).exec()
  }
}
