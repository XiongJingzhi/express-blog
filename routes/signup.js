const express = require('express')
const fs = require('fs')

const checkNotLogin = require('../middlewares/check').checkNotLogin
const salt = require('../config/default').salt
const UserModel = require('../models/user')
const router = express.Router()

// GET /signup 注册页
router.get('/', checkNotLogin, function(req, res, next) {
  res.render('signup')
})

// POST /signup 用户注册
router.post('/', UserModel.validateRegister)

module.exports = router
