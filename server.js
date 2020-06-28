require('dotenv').config()
const express = require('express')
const { join } = require('path')
// const bcrypt = require('bcrypt')
const passport = require('passport')
const cors = require('cors')
const { Strategy } = require('passport-local')
const { Strategy: JWTStrategy, ExtractJwt } = require('passport-jwt')

const app = express()
const { User } = require('./models')

// app.use(express.static(join(__dirname, 'client', 'build')))
app.use(cors())
app.use(express.urlencoded({ extended: true }))
app.use(express.json())

app.use(passport.initialize())
app.use(passport.session())

passport.use(new Strategy(User.authenticate()))
passport.serializeUser(User.serializeUser())
passport.deserializeUser((User.deserializeUser()))

passport.use(new JWTStrategy({
  jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
  secretOrKey: process.env.SECRET
}, ({ id }, cb) => User.findById(id)
  .then(user => cb(null, user))
  .catch(err => cb(err))))

app.use(require('./routes'))

app.use(function (req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

// app.get('*', (req, res) => {
//   res.sendFile(join(__dirname, 'client', 'build', 'index.html'))
// })

require('mongoose').connect('mongodb://localhost/cms_db', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
  .then(() => app.listen(process.env.PORT || 3001, () => console.log('The server is running')))
  .catch(err => console.error(err))
