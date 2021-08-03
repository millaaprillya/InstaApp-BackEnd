const router = require('express').Router()
const user = require('./routes/user.js')

router.use('/user', user)
module.exports = router
