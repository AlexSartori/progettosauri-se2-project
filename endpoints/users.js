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

    //check the required parameters
    var check = check_format(req.body);

    if(!check) {
        //not valid parameters
        res.statusCode = 400;
        res.send('Invalid parameters');
    } else {
        var id;
        DB.edit_data((data) => {
            //check if it's the first user
            if(typeof data['users'] == 'undefined') {
                data['users'] = [];
                id = 0;
            } else {
                //if it's not the first, get the last ID assigned and create a new ID
                id = Object.keys(data['users']).sort().length+1;
            }

            //save the data in the database
            data['users'].push({key: id, value: req.body});
        });

        //send status code
        res.statusCode = 201;
        res.send(String(id));
    }
}

module.exports = {register_endpoint, create_user};