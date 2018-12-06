const DB = require('../DinoBase');

function register_endpoints(app, base_path) {
  app.post(base_path + '/tasks', create_task);
  app.get(base_path + '/tasks', get_available_tasks);
  app.delete(base_path + '/tasks/:task_id', delete_task);
  app.get(base_path + '/tasks/:task_id', get_task);
  app.put(base_path + '/tasks/:task_id', modify_task);
}

function create_task(req, res) {

  // Checks if the text is provided and is a string and if the
  let valid = req.body.text != undefined;
  valid &= typeof(req.body.text) == 'string';

  // Checks if the user id is provided and stores it
  let user = parseInt(req.get('user'));
  valid &= user != NaN;
  let id;

  if (valid) {
    new_task = {
      'text': req.body.text,
      'answers': {},
      'answers_next_id': 0,
      'creator': user
    }

    DB.edit_data(data => {
      // Checks if the user id is an existing user
      valid &= data.users[user] != undefined;

      // Checks if the multiple answers provided are valid
      if (valid && Array.isArray(req.body.answers) && req.body.answers.length > 0) {

        let validMultipleAnswers = 0;
        req.body.answers.forEach(answer => {
          if (typeof(answer.text) == 'string' && typeof(answer.correct) == 'boolean' ) {
            validMultipleAnswers++;
          }
        });

        //Only if all the multiple choice answers are valid the task is valid
        if(validMultipleAnswers == req.body.answers.length && req.body.answers.length >= 2){
          req.body.answers.forEach(answer => {

            let new_answer = {
                'text': answer.text,
                'correct' : answer.correct
            }

            new_answer.id = new_task.answers_next_id++;
            new_task.answers[new_answer.id] = new_answer;
          });
        } else {
          valid = false;
        }
      }

      // Writes in the DB
      if (valid) {
        if(data.tasks) {
          new_task.id = data.tasks_next_id++;
          id = new_task.id;
          data.tasks[new_task.id] = new_task;
        } else {
          data['tasks'] = {};
          data.tasks[0] = new_task;
          data.tasks_next_id = 1;
        }
      }
    });
  }

  if(valid)
    res.status(201).send('' + id);
  else
    res.status(400).send();
}

function delete_task(req, res) {
  let task_id = req.params.task_id;
  let user = parseInt(req.get('user'));
  let status;

  if (user != NaN){

    DB.edit_data(data => {

      if (data.users[user] != undefined) {

        if (data.tasks[task_id] != undefined) {

          if(data.tasks[task_id].creator == user){
            status = 200;
            delete data.tasks[task_id];
          } else
          status = 403;
        } else
          status = 404;
      } else
        status = 400;
    });
  }else
    status = 400;

  res.status(status);
  res.send('');
}

function get_available_tasks(req, res) {
  let result = [];
  let user = parseInt(req.get('user'));
  console.log(user);
  if(user==NaN) {
    res.status(400).send("Bad parameters");
  } else {
    DB.read_data((data) => {
      if (data.tasks) {
        Object.keys(data.tasks).forEach(function(k) {
          let task = data.tasks[k.toString()];
          if(task.creator == user) result.push(k);
        });
      }
    });
    res.status(200).send(result);
  }
}

function get_task(req, res) {
  let task_id = req.params.task_id;
  let user = parseInt(req.get('user'));
  let status;
  let content = '';

  if (user != NaN){

    DB.read_data(data => {

      if (data.users[user] != undefined) {

        if (data.tasks[task_id] != undefined) {
          if(data.tasks[task_id].creator == user){
            status = 200;
            content = data.tasks[task_id];
          } else
          status = 403;
        } else
          status = 404;
      } else
        status = 400;
    });
  }else
    status = 400;

  res.status(status);
  res.send(content);
}

function modify_task(req, res) {

  // Checks if the text is provided and is a string and if the
  let valid = req.body.text != undefined;
  valid &= typeof(req.body.text) == 'string';

  // Checks if the user id is provided and stores it
  let user = parseInt(req.get('user'));
  valid &= user != NaN;

  if (valid) {
    new_task = {
      'text': req.body.text,
      'answers': {},
      'answers_next_id': 0,
      'creator': user
    }

    DB.edit_data(data => {
      // Checks if the user id is an existing user
      valid &= data.users[user] != undefined;
      valid &= data.tasks[req.params.task_id] != undefined;

      // Checks if the multiple answers provided are valid
      if (valid && Array.isArray(req.body.answers) && req.body.answers.length > 0) {

        let validMultipleAnswers = 0;
        req.body.answers.forEach(answer => {
          if (typeof(answer.text) == 'string' && typeof(answer.correct) == 'boolean' ) {
            validMultipleAnswers++;
          }
        });

        //Only if all the multiple choice answers are valid the task is valid
        if(validMultipleAnswers == req.body.answers.length && req.body.answers.length >= 2){
          req.body.answers.forEach(answer => {

            let new_answer = {
                'text': answer.text,
                'correct' : answer.correct
            }

            new_answer.id = new_task.answers_next_id++;
            new_task.answers[new_answer.id] = new_answer;
          });
        } else {
          valid = false;
        }
      }

      // Writes in the DB if the creator is the user
      if (valid && data.tasks[req.params.task_id].creator == user) {
        data.tasks[req.params.task_id] = new_task;
      }
    });
  }

  if(valid)
    res.status(201).send();
  else
    res.status(400).send();
}

module.exports = {register_endpoints, create_task, delete_task,
  get_available_tasks, get_task, modify_task};
