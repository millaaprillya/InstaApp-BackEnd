const helper = require('../helper/response')
// ==> Model <==
// const {getTimeline , [postTimeline]}= require('../model/media')
module.exports = {
  getTimeline: async (request, response) => {
    try {
      console.log(' Berhasil ')
    } catch (error) {
      console.log(error)
      return helper.response(response, 404, ' Bad Request', error)
    }
  },
  postTimeline: async (request, response) => {
    try {
      console.log('Berhasil')
    } catch (error) {
      return helper.response(response, 404, ' Bad Request', error)
    }
  }
}
