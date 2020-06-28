const router = require('express').Router()
const { User } = require('../models')
const jwt = require('jsonwebtoken')
const passport = require('passport')

// Register Route
router.post('/users/register', (req, res) => {
  res.json(req.body)
  const { name, email, username } = req.body
  User.register(new User({ name, email, username }), req.body.password, err => {
    if (err) { console.error(err) }
    res.json(req.body)
  })
})

// router.post('/register', async (req, res) => {
//   try {
//     const hashedPassword = await bcrypt.hash(req.body.password, 10);
//     return
//   } catch (error) {

//   }
// });

// Login Route
router.post('/users/login', (req, res) => {
  User.authenticate()(req.body.username, req.body.password, (err, user) => {
    if (err) { console.error(err) }
    res.json(user ? jwt.sign({ id: user._id }, process.env.SECRET) : null)
  })
})

router.get('/users/pages', passport.authenticate('jwt'), (req, res) => {
  res.json(req.user)
})

router.get('/users/authorize', passport.authenticate('jwt'), (req, res) => {
  res.sendStatus(200)
})

module.exports = router
