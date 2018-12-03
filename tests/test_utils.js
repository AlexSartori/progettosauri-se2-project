const fs = require('fs');
const DB = require('../DinoBase');

//creates a single valid user
function create_valid_user(){
    var user =
    {'users': {
      '0': {
        'id': 0,
        'name': 'test_user',
        'mail': 'mail@test.com',
        'password': 'test'
      }
    },
      'next_user_id': 1
    }
    fs.writeFileSync(DB.DB_PATH, JSON.stringify(user))
    return user.users[0]
}

function create_unvalid_user(){
    var user= {'users': {
      '0': {
        'id': 0,
        'name': 'test_user'
      }
    },
    'next_user_id': 1
  }

  fs.writeFileSync(DB.DB_PATH, JSON.stringify(user))
  return user.users[0]
}

function clean_db(){
    fs.writeFileSync(DB.DB_PATH, {})
    return
}

module.exports = {create_valid_user, clean_db, create_unvalid_user}
