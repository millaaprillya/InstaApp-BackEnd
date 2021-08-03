const helper = require('../helper/response')
const {
  getMessageByRoom,
  createRoom,
  checkRoom,
  getListRoomUser,
  sendMessageModel,
  getRoomById,
  getListSearch,
  deleteRoom,
  getRecentMessage
} = require('../model/Message')
const { getUserByIdModel } = require('../model/auth')

module.exports = {
  sendMessage: async (request, response) => {
    try {
      const { room_id, sender_id, receiver_id, message } = request.body
      const sendMessage = {
        room_id,
        sender_id,
        receiver_id,
        message,
        msg_created_at: new Date()
      }
      if (!request.body.message) {
        return helper.response(response, 400, 'Bad Request')
      }
      const sendChat = await sendMessageModel(sendMessage)
      return helper.response(response, 200, `${sendChat.message}`)
    } catch (error) {
      return helper.response(response, 404, 'Bad Request', error)
    }
  },
  sendFile: async (request, response) => {
    try {
      const { room_id, sender_id, receiver_id } = request.body
      const sendMessage = {
        room_id,
        sender_id,
        receiver_id,
        message: request.file.filename,
        msg_created_at: new Date()
      }
      if (!request.body.message) {
        return helper.response(response, 400, 'Bad Request')
      }
      const sendChat = await sendMessageModel(sendMessage)
      return helper.response(response, 200, `${sendChat.message}`)
    } catch (error) {
      return helper.response(response, 404, 'Bad Request', error)
    }
  },
  getMessageByRoom: async (request, response) => {
    const { id } = request.params
    try {
      const result = await getMessageByRoom(id)
      return helper.response(response, 200, 'Get Messages Success', result)
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  createRoom: async (request, response) => {
    const { sender_id, receiver_id } = request.body
    console.log(request.body)
    try {
      const setData = {
        room_id: Math.floor(Math.random() * 1000),
        sender_id,
        receiver_id,
        room_created_at: new Date()
      }

      const setData2 = {
        room_id: setData.room_id,
        sender_id: setData.receiver_id,
        receiver_id: setData.sender_id,
        room_created_at: new Date()
      }

      const checkDataRoom = await checkRoom(
        setData.sender_id,
        setData.receiver_id
      )
      console.log(checkDataRoom)
      if (checkDataRoom.length > 0) {
        return helper.response(response, 400, 'Room already exist')
      } else {
        const result = await createRoom(setData)
        const result2 = await createRoom(setData2)
        console.log(result2)
        return helper.response(response, 200, 'Room Created', result)
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request')
    }
  },
  getListRoom: async (request, response) => {
    const { id, searchUser } = request.query
    try {
      if (!searchUser) {
        const data = await getListRoomUser(id)
        console.log(data)
        return helper.response(response, 200, 'Get All List Room', data)
      } else {
        const result = await getListSearch(id, searchUser)
        return helper.response(response, 200, 'Get All List Room', result)
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad Request')
    }
  },
  getRoomById: async (request, response) => {
    const { room_id, sender_id } = request.params
    console.log(request.params)
    try {
      const result = await getRoomById(room_id, sender_id)
      const userData = await getUserByIdModel(result[0].receiver_id)
      const lastMessage = await getRecentMessage(room_id)
      console.log(lastMessage)
      result.user_phone = userData[0].user_phone
      result[0].user_bio = userData[0].user_bio
      result[0].user_name = userData[0].user_name
      result[0].profileImage = userData[0].profileImage
      const getMessage = await getMessageByRoom(room_id)
      result[0].messages = getMessage
      const resultAll = { data: result[0], recent: lastMessage }
      return helper.response(response, 200, 'Get Room By Room ID', resultAll)
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad Request')
    }
  },
  deleteRoom: async (request, response) => {
    try {
      const { id } = request.params
      const deleteCheck = await deleteRoom(id)
      return helper.response(response, 200, 'Room Succes Delete', deleteCheck)
    } catch (error) {
      console.log(error)
      return helper.response(response, 404, 'Bad Request', error)
    }
  }
}
