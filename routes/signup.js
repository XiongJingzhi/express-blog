const express = require('express')
const fs = require('fs')
const path = require('path')
const sha256 = require('sha256')

const checkNotLogin = require('../middlewares/check').checkNotLogin
const salt = require('../config/default').salt
const UserModel = require('../models/user')
const router = express.Router()

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', checkNotLogin, function(req, res, next) {
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
    // 注册失败，删除上传的头像
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

  UserModel.getUserByName(user.username)
    .then(function(result){
      if (!result) {
        UserModel.create(user)
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
    .catch(next)
})

module.exports = router
