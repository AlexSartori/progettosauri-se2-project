const DB = require('../DinoBase');

function register_endpoints(app) {
  app.post('/classes', create_class);
  app.get('/classes', get_classes);
}

function create_class(req, res) {
  // Checks if the name is provided and is a string
  let valid = req.body.name != undefined;
  valid &= typeof(req.body.name) == 'string';

  // Checks if the user id is provided and stores it
  let user = req.get('user') || '';
  valid &= user != '';

  if (valid) {
    new_class = {
      'name': req.body.name,
      'creator': parseInt(user),
      'users': []
    }

    DB.edit_data(data => {
      // Checks if the creator is an existing users
      valid &= data.users[new_class.creator] != undefined;

      // Checks which user ids are existing and adds them in the class
      if (valid && Array.isArray(req.body.users)) {
        req.body.users.forEach(class_member => {
          if (data.users[class_member] != undefined) {
            new_class.users.push(class_member);
          }
        });
      }

      // Writes in the DB
      if (valid) {
        new_class.id = data.classes_next_id++;
        data.classes[new_class.id] = new_class;
      }
    });
  }

  if (valid)
    res.status(201);
  else
    res.status(400);
  res.send();
}

function get_classes(req, res) {
  res.status(200);
  res.send('');
}

module.exports = {register_endpoints, create_class, get_classes};
