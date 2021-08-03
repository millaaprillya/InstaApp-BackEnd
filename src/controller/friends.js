const helper = require('../helper/response')
const { addFriends, getListFriend } = require('../model/friends')
const { getUserByIdModel, searchByEmail } = require('../model/auth')

module.exports = {
  addfriends: async (request, response) => {
    try {
      console.log(request.body)
      const { user_id, friends_id } = request.body
      const setData = {
        user_id,
        friends_id,
        friends_created_at: new Date()
      }
      const checkfriends = await getListFriend(friends_id)
      if (checkfriends.length >= 1) {
        return helper.response(
          response,
          400,
          `Kamu sudah Berteman dengan ${friends_id}`
        )
      }
      const seData2 = {
        user_id: setData.friends_id,
        friends_id: setData.user_id,
        friends_created_at: new Date()
      }
      console.log(setData)
      const add1 = await addFriends(setData)
      const add2 = await addFriends(seData2)
      const succes = { sender: add1, friend: add2 }
      return helper.response(response, 200, 'Succes Add Friends', succes)
    } catch (error) {
      return helper.response(response, 400, 'Bad request', error)
    }
  },
  getFriends: async (request, response) => {
    try {
      const { id, find } = request.query
      console.log(request.query)
      if (!find) {
        const checkUser = await getUserByIdModel(id)
        if (checkUser.length > 0) {
          const result = await getListFriend(id)
          return helper.response(response, 200, 'List Your Friends', result)
        } else {
          return helper.response(response, 404, `Data Not Found By Id ${id}`)
        }
      } else {
        const findUser = await searchByEmail(find)
        return helper.response(response, 200, 'Succes Find Friends', findUser)
      }
    } catch (error) {
      return helper.response(response, 400, ' Bad Request', error)
    }
  }
}
