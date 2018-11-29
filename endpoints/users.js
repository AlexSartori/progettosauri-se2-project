const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/users', create_user);
    app.get('/users/:user_id', get_user_details);
    app.delete('/users/:user_id', delete_user);
    app.put('/users/:user_id',edit_user_details)
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

// Check path validity
function check_path(id){
  if (id < 0 || isNaN(parseInt(id, 10))) {
    return false
  } else {
    return true}
}
  // Check body validity
function check_body(param) {
    Valid = true;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.surname != undefined && typeof(param.name) == 'string';
    valid &= param.email != undefined  && typeof(param.email) == 'string';
    valid &= param.password != undefined && typeof(param.password) == 'string';
    return valid
}

function get_user_details(req, res){
    if (!check_path(req.params.user_id)){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        DB.edit_data((data) => {
        //check if the user exists
           found = false
           if(typeof data['users'] == 'undefined'){
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
  if (!check_path(req.params.user_id)){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        //check permissions
        if (req.get('user') !== req.params.user_id){
            res.status(403).send("Permission denied, you are trying to delete an other user's account")
        } else { 
            DB.edit_data((data) => {
                //check if the user exists
                found = false
                if(typeof data['users'] == 'undefined'){
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



function edit_user_details(req, res) {
  if (!check_body(req.body) || !check_path(req.params.user_id)) {
    res.status(400).send("Bad parameter");
  } else {
      //check permissions
      if (req.get('user') !== req.params.user_id){
        res.status(403).send("Permission denied, you are trying to delete an other user's account")
      } else { 
        let found = false;
        DB.edit_data((data) => {
            if(data['users']) {
                for (i in data['users'])
                    if (data['users'][i].key == req.params.user_id){
                        data['users'][i].value = req.body;
                        res.status(200).send(data['users'][i])
                        found = true
                    }
                }
        });
        if (!found){
            res.status(404).send("User does not exist");
        }
    }
}
}
module.exports = {register_endpoints, create_user, get_user_details, delete_user, edit_user_details};
