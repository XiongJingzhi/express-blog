import express from 'express'
import path from 'path'
import { indexRouter } from './routes/index'
import { userRouter } from './routes/users'

const app = express()
const port = 3000

app.set('views', path.join(__dirname, 'views'))
app.set('view engine', 'ejs')

// app.use('/', indexRouter)
app.use('/users', userRouter)

app.use(express.static('public'))

app.use(function(req, res, next) {
  console.log('1')
  next(new Error('haha'))
})

app.use(function(req, res, next) {
  console.log('2')
  res.status(200).end()
})

app.use(function (err, req, res, next) {
  console.error(err.stack)
  res.status(500).send('Something broke!')
})


app.listen(port, () => console.log(`Example app listening on port ${port}!`))
