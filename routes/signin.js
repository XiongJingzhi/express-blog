const sha256 = require('sha256')
const express = require('express')
const router = express.Router()

const UserModel = require('../models/user')
const checkNotLogin = require('../middlewares/check').checkNotLogin

// GET /signin 登录页
router.get('/', checkNotLogin, function (req, res, next) {
  res.render('signin')
})

// POST /signin 用户登录
router.post('/', checkNotLogin, UserModel.validateLogin)

module.exports = router
