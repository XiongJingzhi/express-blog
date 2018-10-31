const path = require('path')
const assert = require('assert')
const request = require('supertest')
const app = require('../index')
const User = require('../models/user')

const testName1 = 'fsfsavxz@#$_!'
const testName2 = '12321fsadf!~'

describe('signup', function() {
  describe('POST /signup', function() {
    const agent = request.agent(app)
    // 每一个测试用例之前，钩子函数
    beforeEach(function(done) {
      User.create({
        username: testName1,
        password: '123456aa',
        avatar: 'sa.jpg',
        gender: 'x',
        bio: '东安懂奥',
      })
        .then(function (res) {
          done()
        })
        .catch(done)
    })
    // 每一个测试用例后，删除用例
    afterEach(function(done) {
      User.deleteMany({
        username: { $in: [testName1, testName2]}
      })
        .then(function() {
          done()
        })
        .catch(done)
    })
    // 全部结束退出当前进程
    after(function (done) {
      process.exit()
    })

    // 用户错误的情况
    it('wrong name', function(done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: ''})
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          // console.log('res.text', res)
          assert(res.text.match(/名字请限制在 1-10 个字符/))
          done()
        })
    })

    // 性别错误的情况
    it('wrong gender', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName2, gender: 'a'})
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/性别只能是 m、f 或 x/))
          done()
        })
    })

    // 密码不一致的情况
    it('wrong repassword', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName2, gender: 'm', bio:'fsafds', password: 'sdsada11', repassword: 'daqqasxx'})
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/两次输入密码不一致/))
          done()
        })
    })

    // 用户名已存在的情况
    it('duplicate username', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: 'tom', gender: 'm', bio:'fsafds', password: 'sdsada11', repassword: 'sdsada11'})
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户名已存在/))
          done()
        })
    })

    // 成功的情况
    it('register success', function (done) {
      agent
        .post('/signup')
        .type('form')
        .field({name: testName2, gender: 'm', bio:'fsafds', password: 'sdsada11', repassword: 'sdsada11'})
        .attach('avatar', path.join(__dirname, 'avatar.jpg'))
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/注册成功/))
          done()
        })
    })
  })
})
