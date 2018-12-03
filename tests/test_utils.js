const fs = require('fs');
const DB = require('../DinoBase');

function create_valid_user(x){
    var user= {"users":[{
        "key":x,
             "value":{"email":"prova@dinomail.com",
             "password":"dinopwd",
             "name":"dinoname",
             "surname":"dinosurname"}}]
    }
    fs.writeFileSync(DB.DB_PATH, JSON.stringify(user))
    return user
}

function create_unvalid_user(x){
    var user= {"users":[{
        "key":x,
             "value":{"email":"prova@dinomail.com"}}]
    }

    fs.writeFileSync(DB.DB_PATH, JSON.stringify(user))
    return user
}

function clean_db(){
    fs.writeFileSync(DB.DB_PATH, '{}');
}

module.exports = {create_valid_user, clean_db, create_unvalid_user}
