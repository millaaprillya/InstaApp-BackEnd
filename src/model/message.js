const connection = require('../config/mysql')

module.exports = {
  insertMessage: (data) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO messages SET ?', data, (error, result) => {
        if (!error) {
          resolve(result)
        } else {
          reject(new Error(error))
        }
      })
    })
  },
  getMessageByRoom: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM messages WHERE room_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : console.log(error)
        }
      )
    })
  },
  deleteRoom: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'DELETE  FROM messages WHERE room_id = ?',
        id,
        (error, result) => {
          console.log(error)
          !error ? resolve(result) : console.log(error)
        }
      )
    })
  },
  getRecentMessage: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM messages WHERE room_id = ? ORDER BY msg_created_at DESC LIMIT 1',
        id,
        (error, result) => {
          !error ? resolve(result) : console.log(error)
        }
      )
    })
  },
  createRoom: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query('INSERT INTO room SET ?', setData, (error, result) => {
        if (!error) {
          const newResult = {
            id: result.insertId,
            ...setData
          }
          resolve(newResult)
        } else {
          console.log(error)
          reject(new Error(error))
        }
      })
    })
  },
  createRoomMessage: (setData) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO message SET ?',
        setData,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...setData
            }
            resolve(newResult)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  },
  checkRoom: (sender, receiver) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT * FROM room WHERE sender_id = ${sender} AND receiver_id = ${receiver}`,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getListRoomUser: (id) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT room.room_id, user.user_id,user.user_name, user.profileImage FROM room JOIN user ON room.receiver_id = user.user_id WHERE sender_id = ?',
        id,
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getListSearch: (id, searchUser) => {
    return new Promise((resolve, reject) => {
      connection.query(
        `SELECT room.room_id, user.user_id,user.user_name, user.profileImage FROM room JOIN user ON room.receiver_id = user.user_id WHERE sender_id = ? AND user.user_name LIKE '%${searchUser}%'`,
        id,
        (error, result) => {
          console.log(result)
          console.log(error)
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  getRoomById: (room, sender) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'SELECT * FROM room WHERE room_id = ? AND sender_id = ?',
        [room, sender],
        (error, result) => {
          !error ? resolve(result) : reject(new Error(error))
        }
      )
    })
  },
  sendMessageModel: (sendMessage) => {
    return new Promise((resolve, reject) => {
      connection.query(
        'INSERT INTO messages SET ?',
        sendMessage,
        (error, result) => {
          if (!error) {
            const newResult = {
              id: result.insertId,
              ...sendMessage
            }
            resolve(newResult)
          } else {
            console.log(error)
            reject(new Error(error))
          }
        }
      )
    })
  }
}
