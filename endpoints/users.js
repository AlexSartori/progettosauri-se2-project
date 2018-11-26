const DB = require('../DinoBase');
var bodyParser = require('body-parser');

function register_endpoint(app) {
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({ extended: false }));

    app.post('/users', create_user);
}

function create_user(req, res) {
    /*
    var surname = req.body['surname'];
    var name = req.body['name'];
    var mail = req.body['email'];
    var password = req.body['password'];
    */
    console.log(req.body['name']);
    
    DB.edit_data((data) => {
        if(typeof data['users'] == 'undefined') data['users'] = Array();
        data['users'].push(req.body);
        return data;
    });
    
    res.send('Create user function');
    
}

module.exports = {register_endpoint, create_user};