const router = require('express').Router()
const uploadImage = require('../middleware/multer')
// const sendfile = require('../middleware/message')
const {
  login,
  register,
  patchimg,
  userByid,
  searchUser,
  settings
} = require('../controller/user')
const { addfriends, getFriends } = require('../controller/friends')
const {
  createRoom,
  getListRoom,
  getRoomById,
  getMessageByRoom,
  sendMessage,
  sendFile,
  deleteRoom
} = require('../controller/message')
// ===> user <===
router.get('/search', searchUser)
router.get('/:id', userByid)
router.post('/register', register)
router.post('/login', login)
router.patch('/:id', settings)
router.patch('/img/:id', uploadImage, patchimg)

// ==> friends <==
router.get('/friends/find/', getFriends)
router.post('/addfriends', addfriends)
// ==> Chat <==
router.get('/chat/:id', getMessageByRoom)
router.post('/Chat', sendMessage)
router.post('/chat/sendFile', sendFile)
// ==> room <==
router.post('/create', createRoom)
router.get('/list/friends', getListRoom)
router.get('/byid/room/:room_id/:sender_id', getRoomById)
router.delete('/room/user/:id', deleteRoom)

module.exports = router
