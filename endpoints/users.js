const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/users', create_user);
    app.get('/users/:user_id', get_user_details);
    app.delete('/users/:user_id', delete_user);
    app.put('/users/:user_id',edit_user_details)
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
    valid = true;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.mail != undefined  && typeof(param.mail) == 'string';
    valid &= param.password != undefined && typeof(param.password) == 'string';
    return valid
}

function create_user(req, res) {
  //check the required parameters
    if (!check_body(req.body)){
        //not valid parameters
        res.statusCode = 400;
        res.send('Bad parameter');
    } else {
        DB.edit_data((data) => {
          //check if it's the first user and if the param users_next_id is already defined in db
       if(typeof data.users[users] == 'undefined') {
            data.users_next_id = -1
          }

        //save the data in the database
       var id = data.users_next_id++
       var new_user =  {'id': id,
                        'name': req.body.name,
                        'mail': req.body.mail,
                        'password': req.body.password }
        data.users[id] =  req.body//new_user
        data.users_next_id++
        //send status code
        res.status(201).send(JSON.stringify(data.users[id].id));
      });


  }
}

function get_user_details(req, res){
    if (!check_path(req.params.user_id)){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        DB.edit_data((data) => {
        //check if the user exists
            if (typeof(data.users[req.params.user_id])!=undefined){
                res.status(200).send(data.users[req.params.user_id])
            } else {
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
        if (req.get('user') != req.params.user_id){
            res.status(403).send("Permission denied, you are trying to delete an other user's account")
        } else {
            DB.edit_data((data) => {
                //check if the user exists
                found = false
                if ((typeof(data.users[req.params.user_id])!=undefined)){
                  delete data.users[req.params.user_id]
                  res.status(200).send("Success, account has been deleted")
                } else {
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
      if (req.get('user') != req.params.user_id){
        res.status(403).send("Permission denied, you are trying to delete an other user's account")
      } else {
        DB.edit_data((data) => {
          // Check if user exists
            if(data.users[req.params.user_id]) {
                data.users[req.params.user_id] = req.body;
                res.status(200).send(data.users[req.params.user_id])
            } else {
                res.status(404).send("User does not exist");
           }
      });
     }
  }
}

module.exports = {register_endpoints, create_user, get_user_details, delete_user, edit_user_details};
