const assert = require('assert')
const request = require('supertest')
const app = require('../index')

describe('signin', function() {
  describe('POST /signin', function() {
    const agent = request.agent(app)
    // 全部结束退出当前进程
    // after(function (done) {
    //   process.exit()
    // })

    // 用户不存在的情况
    it('undefined name', function(done) {
      agent
        .post('/signin')
        .type('form')
        .field({name: 'dasdasd', password: 'dsadasdas'})
        .redirects()
        .end(function(err, res) {
          if (err) {
            return done(err)
          }
          assert(res.text.match(/用户不存在/))
          done()
        })
    })

    // 密码错误的情况
    it('wrong password', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({name: 'ssss', password: 'sdsada11'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/用户名或密码错误/))
          done()
        })
    })

    // 登录成功的情况
    it('success password', function (done) {
      agent
        .post('/signin')
        .type('form')
        .field({name: 'ssss', password: 'aaaaaa'})
        .redirects()
        .end(function (err, res) {
          if (err) return done(err)
          assert(res.text.match(/登录成功/))
          done()
        })
    })

  })
})
