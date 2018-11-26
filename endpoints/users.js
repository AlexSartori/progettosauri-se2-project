const DB = require('../DinoBase');
var bodyParser = require('body-parser');

function register_endpoint(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.post('/users', create_user);
}

function create_user(req, res) {

    function check_format(body) {
        if("name" in body && "surname" in body && "email" in body && "password" in body) {
            return true;
        } else {
            return false;
        }
    }
    
    DB.edit_data((data) => {

        var check = check_format(req.body);

        if(!check) {
            res.statusCode = 400;
            console.log('Invalid parameters');
        } else {
            var id;

            if(typeof data['users'] == 'undefined') {
                data['users'] = [];
                id = 0;
            } else {
                id = Object.keys(data['users']).sort().length+1;
            }
    
            data['users'].push({key: id, value: req.body});
            res.statusCode = 201;
            console.log('New user created');
        }
        
    });

    res.send();
}

module.exports = {register_endpoint, create_user};