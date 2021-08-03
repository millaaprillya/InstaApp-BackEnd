const {
  loginCheckModel,
  registerUserModel,
  getUserByIdModel,
  searchByEmail,
  patchUsertModel,
  patchUser
} = require('../model/auth')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const helper = require('../helper/response')
const fs = require('fs')

module.exports = {
  login: async (request, response) => {
    try {
      const { user_email, user_password } = request.body
      console.log(request.body)

      if (request.body.user_email === '') {
        return helper.response(response, 400, 'Insert email Please :)')
      } else if (request.body.user_password === '') {
        return helper.response(response, 400, 'Insert Password Please :)')
      } else {
        const checkDataUser = await loginCheckModel(user_email)
        console.log(checkDataUser)

        if (checkDataUser.length > 0) {
          const checkPassword = bcrypt.compareSync(
            user_password,
            checkDataUser[0].user_password
          )
          if (checkPassword) {
            const { id, user_name, user_email } = checkDataUser[0]
            const paylot = {
              id,
              user_name,
              user_email
            }
            const token = jwt.sign(paylot, '', { expiresIn: '10h' })
            const result = { ...paylot, token }
            return helper.response(response, 200, 'Succes Login ', result)
          } else {
            return helper.response(
              response,
              404,
              `Sorry wrong password ! for ${user_email}`
            )
          }
        } else {
          return helper.response(response, 404, 'account not register !')
        }
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 404, 'Bad request', error)
    }
  },
  register: async (request, response) => {
    try {
      const {
        user_name,
        user_email,
        user_password,
        user_phone,
        user_address,
        user_country
      } = request.body
      const salt = bcrypt.genSaltSync(10)
      const encryptPassword = bcrypt.hashSync(user_password, salt)
      const setData = {
        user_name,
        user_email,
        user_password: encryptPassword,
        user_phone,
        user_address,
        user_country
      }
      const checkDataUser = await loginCheckModel(user_email)
      if (checkDataUser.length >= 1) {
        if (!request.body.user_name) {
          return helper.response(response, 404, 'Insert Username first !!')
        } else if (!request.body.user_email) {
          return helper.response(response, 404, ' Insert Email first ')
        } else if (!request.body.user_password) {
          return helper.response(
            response,
            404,
            " Password can't to be null !! "
          )
        }
        return helper.response(response, 404, 'email has been resgisted !!')
      } else if (request.body.user_email === '') {
        return helper.response(response, 404, 'Insert @email first')
      } else if (request.body.user_email.search('@') < 1) {
        return helper.response(response, 400, 'Email not valid  !!, must be @ ')
      } else if (request.body.user_email.search('.com') < 1) {
        return helper.response(response, 400, 'Email not valid  !!')
      } else if (
        request.body.user_password.length < 8 ||
        request.body.user_password.length > 16
      ) {
        return helper.response(
          response,
          400,
          'Password must be 8 - 16 characters '
        )
      } else {
        const result = await registerUserModel(setData)
        return helper.response(
          response,
          200,
          'Succes Register account ',
          result
        )
      }
    } catch (error) {
      console.log(error)
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  patchimg: async (request, response) => {
    try {
      const { id } = request.params
      console.log(id)
      console.log(request.body)
      const setData = {
        profileImage: request.file.filename
      }
      const cekId = await getUserByIdModel(id)
      if (cekId.length > 0) {
        if (cekId[0].profileImage === '' || request.file === undefined) {
          const result = await patchUser(setData, id)
          return helper.response(response, 201, 'Profile Updated', result)
        } else {
          fs.unlink(
            `./uploads/user/${cekId[0].profileImage}`,
            async (error) => {
              if (error) {
                throw error
              } else {
                const result = await patchUser(setData, id)
                return helper.response(response, 201, 'Profile Updated', result)
              }
            }
          )
        }
      }
    } catch (error) {
      return helper.response(response, 400, 'Bad Request', error)
    }
  },
  userByid: async (req, res) => {
    const { id } = req.params
    try {
      const result = await getUserByIdModel(id)
      return helper.response(res, 200, 'Get User by Id Success', result)
    } catch (error) {
      return helper.response(res, 400, 'Bad Request')
    }
  },
  searchUser: async (req, res) => {
    const { email } = req.query
    try {
      const result = await searchByEmail(email)
      if (result.length > 0) {
        return helper.response(res, 200, `Found ${result.length} user`, result)
      } else {
        return helper.response(res, 404, 'User Not Found')
      }
    } catch (error) {
      return helper.response(res, 400, 'Bad Request')
    }
  },
  settings: async (request, response) => {
    try {
      console.log(request.body)
      const { id } = request.params
      let {
        user_name,
        user_phone,
        user_email,
        user_bio,
        user_lat,
        user_lng
      } = request.body
      const checkUser = await getUserByIdModel(id)
      console.log(checkUser)
      if (checkUser.length > 0) {
        if (user_email === '') {
          user_email = checkUser[0].user_email
        }
        if (user_name === '') {
          user_name = checkUser[0].user_name
        }
        if (user_phone === '') {
          user_phone = checkUser[0].user_phone
        }
        if (user_bio === '') {
          user_phone = checkUser[0].user_bio
        }
        const setData = {
          user_name,
          user_phone,
          user_email,
          user_bio,
          user_lat,
          user_lng,
          user_update_at: new Date()
        }
        const result = await patchUsertModel(id, setData)
        return helper.response(response, 200, 'Succes Update Data', result)
      } else {
        return helper.response(response, 404, `Data Not Found By Id ${id}`)
      }
    } catch (error) {
      return helper.response(response, 400, 'Data Failed Update', error)
    }
  }
}
