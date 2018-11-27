const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/exams', create_exam);
}

function create_exam(req, res) {
    // Check validity
    let param = req.body, valid = true;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.taskGroup != undefined && typeof(param.taskGroup) == 'number';
    valid &= param.mode != undefined && typeof(param.mode) == 'string' && (param.mode == 'exam' || param.mode == 'crowd sourcing');
    valid &= param.class != undefined && typeof(param.class) == 'number';
    valid &= param.TA != undefined && typeof(param.TA) == 'object' && param.TA.length > 0;
    if (valid) param.TA.forEach((ta) => { valid &= typeof(ta) == 'number' });
    valid &= new Date(param.deadline).toString() !== "Invalid Date";
    valid &= param.duration != undefined && typeof(param.duration) == 'number';
    valid &= new Date(param.start).toString() !== "Invalid Date";

    if (!valid) {
        res.status(400).send();
    } else {
        DB.edit_data((data) => {
            if(typeof data['exams'] == 'undefined') data['exams'] = [];
            next_id = Object.keys(data['exams']).sort().length+1;
            new_exam = param;
            new_exam.id = next_id;
            data['exams'].push({key: next_id, value: new_exam});
        });

        res.status(201).send('' + next_id);
    }
}

module.exports = {register_endpoints};
