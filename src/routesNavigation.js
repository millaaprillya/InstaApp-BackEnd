const router = require('Express').Router()
// ==> user <==
const user = require('./routes/user')
router.use('/user', user)

const media = require('./routes/media')
router.use('/media', media)
module.exports = router
