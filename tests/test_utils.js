const fs = require('fs');
const DB = require('../DinoBase');

function create_users(){
    var users =
    {'users': {
      '0': {
        'id': 0,
        'name': 'test_user',
        'mail': 'mail@test.com',
        'password': 'test'
      },
      '1': {
        'id': 1,
        'name': 'test_user',
        'mail': 'mail@test.com',
        'password': 'test'
      }
    },
      'users_next_id': 2
    }
    fs.writeFileSync(DB.DB_PATH, JSON.stringify(users))
  return users
}

function clean_db(){
    fs.writeFileSync(DB.DB_PATH, '{}')
    return
}

module.exports = {create_users, clean_db}
