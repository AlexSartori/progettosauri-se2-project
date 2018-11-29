const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/users', create_user);
    app.get('/users/:user_id', get_user_details);
    app.delete('/users/:user_id', delete_user);
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
        res.send(JSON.stringify({id: String(id)}));
    }
}

function get_user_details(req, res){

    function check_parameter(id){
        if (id < 0 || isNaN(parseInt(id, 10))) {
            return false
        } else {
            return true}
    }

    var check = check_parameter(req.params.user_id)

    if (!check){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        DB.edit_data((data) => {
        //check if the user exists
           found = false
           if(!data['users']){
            res.status(404).send("User does not exist")
           } else {
                for(i in data['users']){
                    if (data['users'][i].key == req.params.user_id){
                        found = true
                        res.status(200).send(data['users'][i])
                    }
                }
            }
            
            if(!found){
                res.status(404).send("User does not exist")
            }
            
        });
      
    }
}

function delete_user(req, res){ 
    function check_parameter(id){
        if (id < 0 || isNaN(parseInt(id, 10))) {
            return false
        } else {
            return true}
    }

    var check = check_parameter(req.params.user_id)
    //var checkH = check_header(req.get('user'))

    if (!check){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        //check permissions
        if (req.get('user') !== req.params.user_id){
            res.status(403).send("Permission denied, you are trying to delete an other user's account")
        } else { 
            DB.edit_data((data) => {
                //check if the user exists
                found = false
                if(!data['users']){
                  res.status(404).send("User does not exist")
                } else {
                    for(i in data['users']){
                        if (data['users'][i].key == req.params.user_id){
                            found = true
                            data['users'].splice(i,1)
                            res.status(200).send("Success, account has been deleted")
                        }
                    }
                }
                if(!found){
                    res.status(404).send("User does not exist")
                }
            });
        }   
    
    }
}

module.exports = {register_endpoints, create_user, get_user_details, delete_user };
