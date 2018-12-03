const DB = require('../DinoBase');

function register_endpoints(app) {
  app.post('/tasks', create_task);
}

function create_task(req, res) {

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
      'answers_next_id': 0
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
        new_task.id = data.tasks_next_id++;
        data.tasks[new_task.id] = new_task;
      }
    });
  }

  if(valid)
    res.status(201);
  else
    res.status(400);

  res.send();
}

module.exports = {register_endpoints, create_task};
