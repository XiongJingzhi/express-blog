const path = require('path')
const fs = require('fs')
const sha256 = require('sha256')

const User = require('./mongo').User
const salt = require('../config/default').salt

module.exports = {
  // 注册用户,返回promise
  create: function(user) {
    user = new User(user)
    return User.create(user)
  },
  // 获取用户信息
  getUserByName: function(name) {
    return User.findOne({username: name}).exec()
  },
  // 验证注册
  validateRegister: function(req, res, next) {
    const name = req.fields.name
    const gender = req.fields.gender
    const bio = req.fields.bio
    const avatar = req.files.avatar.path.split(path.sep).pop()
    let password = req.fields.password
    const repassword = req.fields.repassword
    // 校验参数
    try {
      if (!(name.length >= 1 && name.length <= 20)) {
        throw new Error('名字请限制在 1-10 个字符')
      }
      if (['m', 'f', 'x'].indexOf(gender) === -1) {
        throw new Error('性别只能是 m、f 或 x')
      }
      if (!(bio.length >= 1 && bio.length <= 1000)) {
        throw new Error('个人简介请限制在 1-30 个字符')
      }
      if (!req.files.avatar.name) {
        throw new Error('缺少头像')
      }
      if (password.length < 6) {
        throw new Error('密码至少 6 个字符')
      }
      if (password !== repassword) {
        throw new Error('两次输入密码不一致')
      }
    } catch (err) {
      // 注册失败，异步删除上传的头像
      fs.unlinkSync(req.files.avatar.path)
      req.flash('error', err.message)
    }
    // format 请求
    let user = {
      username: name,
      password: sha256(password + salt),
      avatar: avatar,
      gender: gender,
      bio: bio
    }
    User.findOne({username: user.username})
      .exec(function(err, backRes) {
        if (!backRes) {
          User.create(new User(user))
            .then(function (result) {
              // 删除密码这种敏感信息，将用户信息存入 session
              delete result.password
              req.session.user = result
              req.flash('success', '注册成功')
              res.redirect('/posts')
            })
            .catch(function (e) {
              req.flash('error', '写入失败，注册失败')
              res.redirect('/signup')
            })
        } else {
          fs.unlinkSync(req.files.avatar.path)
          req.flash('error', '用户名已存在')
          res.redirect('/signup')
        }
      })
  },
  // 验证登录
  validateLogin: function(req, res, next) {
    const name = req.fields.name
    const password = req.fields.password

    // 校验参数
    try {
      if (!name.length) {
        throw new Error('请填写用户名')
      }
      if (!password.length) {
        throw new Error('请填写密码')
      }
    } catch (e) {
      req.flash('error', e.message)
      return res.redirect('back')
    }

    User.findOne({username: name})
      .then(function (user) {
        if (!user) {
          req.flash('error', '用户不存在')
          return res.redirect('back')
        }
        // 检查密码是否匹配
        var salt = require('../config/default').salt
        if (sha256(password + salt) !== user.password) {
          req.flash('error', '用户名或密码错误')
          return res.redirect('back')
        }
        req.flash('success', '登录成功')
        // 用户信息写入 session
        delete user.password
        req.session.user = user
        // 跳转到主页
        res.redirect('/posts')
      })
      .catch(next)
  }
}
