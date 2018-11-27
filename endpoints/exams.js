const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/exams', create_exam);
    app.get('/exams/:exam_id', get_exam);
    app.delete('/exams/:exam_id', delete_exam);
    app.put('/exams/:exam_id', edit_exam);
}

function get_exam(req, res) {
    let found = false;

    DB.edit_data((data) => {
        if (!data['exams']) return;

        data['exams'].forEach((e) => {
            if (e.key == req.params.exam_id)
                found = e;
        });
    });

    if (found) {
        let exam = found.value;
        exam.id = found.key;
        res.status(200).send(JSON.stringify(exam));
    } else {
        res.status(404).send("No such exam");
    }
}

function delete_exam(req, res) {
    let found = false;

    DB.edit_data((data) => {
        if (data['exams']) {
            for (let i = 0; i < data['exams'].length; i++) {
                if (data['exams'][i].key == req.params.exam_id) {
                    found = true;
                    data['exams'].splice(i, 1);
                }
            }
        }
    });

    if (found) {
        res.status(200).send();
    } else {
        res.status(404).send("No such exam");
    }
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

function edit_exam(req, res) {
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
        let found = false;

        DB.edit_data((data) => {
            if(data['exams']) {
                for (let i = 0; i < data['exams'].length; i++)
                    if (data['exams'][i].key == req.params.exam_id)
                        found = data['exams'][i];
                found.value = param;
            }
        });

        if (found)
            res.status(200).send();
        else {
            res.status(404).send("No such exam");
        }
    }
}

module.exports = {register_endpoints};
