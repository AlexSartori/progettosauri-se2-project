const DB = require('../DinoBase');

function register_endpoints(app) {
    app.get('/exams/:exam_id', get_exam);
    app.post('/exams', create_exam);
    app.delete('/exams/:exam_id', delete_exam);
    app.put('/exams/:exam_id', edit_exam);
}

function get_exam(req, res) {
    if (!req.params.exam_id || isNaN(parseInt(req.params.exam_id)))
        res.status(400).send("Invalid ID");
    else {
        DB.edit_data((data) => {
            if (data.exams && data.exams[req.params.exam_id])
                res.status(200).send(JSON.stringify(data.exams[req.params.exam_id]));
            else
                res.status(404).send("No such exam");
        });
    }
}

function delete_exam(req, res) {
    DB.edit_data((data) => {
        if (data.exams && data.exams[req.params.exam_id]) {
            let ex = data.exams[req.params.exam_id];
            if (ex.TA.some((ta) => ta == parseInt(req.get('user')))) {
                delete data.exams[req.params.exam_id];
                res.status(200).send();
            } else {
                res.status(403).send("Permission denied");
            }
        } else {
            res.status(404).send("No such exam");
        }
    });
}

function create_exam(req, res) {
    // Check validity
    let param = req.body, valid = true;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.taskGroup != undefined && typeof(param.taskGroup) == 'number';
    valid &= param.mode != undefined && typeof(param.mode) == 'string' && (param.mode == 'exam' || param.mode == 'crowd sourcing');
    valid &= param.class != undefined && typeof(param.class) == 'number';
    valid &= param.TA != undefined && Array.isArray(param.TA) &&
             param.TA.length > 0 && param.TA.every((a) => typeof(a) == 'number');
    valid &= new Date(param.deadline).toString() !== "Invalid Date";
    valid &= param.duration != undefined && typeof(param.duration) == 'number';
    valid &= new Date(param.start).toString() !== "Invalid Date";

    if (!valid) {
        res.status(400).send();
    } else {
        DB.edit_data((data) => {
            if (!data.exams) data.exams = { exams_next_id: 0 };
            next_id = data.exams.exams_next_id++;
            new_exam = param;
            new_exam.id = next_id;
            data.exams[next_id] = new_exam;
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

    let id = parseInt(req.params.exam_id);
    if (!valid) {
        res.status(400).send();
    } else if (!data.exams || !data.exams[id]) {
        res.status(404).send("No such exam");
    } else {
        DB.edit_data((data) => {
            if (data.exams[id].TA.some((ta) => ta == parseInt(req.get('user')))) {
                new_exam = param;
                new_exam.id = parseInt(id);
                data.exams[id] = new_exam;
                res.status(200).send(JSON.stringify(new_exam));
            } else {
                res.status(403).send("Permission denied");
            }
        });
    }
}

module.exports = { register_endpoints };
