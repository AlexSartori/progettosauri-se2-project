const DB = require('../DinoBase');

function register_endpoints(app, base_path) {
    app.post(base_path + '/users', create_user);
    app.get(base_path + '/users/:user_id', get_user_details);
    app.delete(base_path + '/users/:user_id', delete_user);
    app.put(base_path + '/users/:user_id',edit_user_details);
}

// Check path validity
function check_path(id){
  return !(id < 0 || isNaN(parseInt(id, 10)));
}

// Check body validity
function check_body(param) {
    valid = true;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.mail != undefined  && typeof(param.mail) == 'string';
    valid &= param.password != undefined && typeof(param.password) == 'string';
    return valid;
}

// POST /users
function create_user(req, res) {
  //check the required parameters
  if (!check_body(req.body)){
        //not valid parameters
        res.status(400).send('Bad parameter');
    } else {
        DB.edit_data((data) => {
        //check if it's the first user
       if(!data.users) {
          data.users= {}
          data.users_next_id = 0
       }
       //save data in database
       var id = data.users_next_id
       var user = {'id':id,
                  'name':req.body.name,
                  'mail':req.body.mail,
                  'password':req.body.password}
       data.users[id] = user
       data.users_next_id++
        //send status code
       res.status(201)
       res.send(id.toString());
      });
  }
}

// GET /users/:user_id
function get_user_details(req, res){
  //Check required parameters
    if (!check_path(req.params.user_id)){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
    } else {
        DB.edit_data((data) => {
        //check if the user exists else sende error
            if (data.users && data.users[req.params.user_id] != undefined){
                res.status(200).send(data.users[req.params.user_id])
            } else {
               res.status(404).send("User does not exist")
            }
          });

    }
}

// DELETE /users/:user_id
function delete_user(req, res){
  // Check parameters
  if (!check_path(req.params.user_id)){
        res.status(400).send("Bad parameter, user_id should be a positive integer")
  } else {
        //Check permissions
        if (req.get('user') != req.params.user_id){
            res.status(403).send("Permission denied, you are trying to delete an other user's account")
        } else {
            DB.edit_data((data) => {
                //Check: if the user exists delete it else send error
                if (data.users && data.users[req.params.user_id] != undefined){
                  delete data.users[req.params.user_id]
                  res.status(200).send("Success, account has been deleted")
                } else {
                  res.status(404).send("User does not exist")
                }
            });
       }
  }
}

// PUT users/:user_id
function edit_user_details(req, res) {
  //Check parameters
  if (!check_body(req.body) || !check_path(req.params.user_id) || !check_path(req.get('user'))) {
    res.status(400).send("Bad parameter");
  } else {
      //Check permissions
      if (req.get('user') != req.params.user_id){
        res.status(403).send("Permission denied, you are trying to edit an other user's account")
      } else {
        DB.edit_data((data) => {
          // Check if user exists else send error
            if(data.users && data.users[req.params.user_id] != undefined) {
                data.users[req.params.user_id] = req.body;
                res.status(200).send(data.users[req.params.user_id])
            } else {
                res.status(404).send("User does not exist");
           }
      });
     }
  }
}

module.exports = {register_endpoints, create_user, get_user_details, delete_user, edit_user_details, check_path};
