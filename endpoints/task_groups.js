const DB = require('../DinoBase');

function register_endpoints(app) {
    app.get('/task_groups', get_all_tgs);
    app.get('/task_groups/:tg_id', get_tg);
    app.post('/task_groups', create_tg);
    app.put('/task_groups/:tg_id', edit_tg);
    app.delete('/task_groups/:tg_id', delete_tg);
}

function get_all_tgs(req, res) {
    let result = [];

    DB.read_data((data) => {
        if (data.task_groups)
            Object.keys(data.task_groups).forEach((k) => result.push(data.task_groups[k]));
    });

    res.status(200).send(result);
}

function get_tg(req, res) {
    if (!req.params.tg_id || isNaN(parseInt(req.params.tg_id)))
        res.status(400).send("Invalid ID");
    else {
        DB.read_data((data) => {
            if (data.task_groups && data.task_groups[req.params.tg_id])
                res.status(200).send(data.task_groups[req.params.tg_id]);
            else
                res.status(404).send("No such Task Group");
        });
    }
}

function edit_tg(req, res) {
    let valid = true, param = req.body;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.tasks != undefined && Array.isArray(param.tasks) &&
             param.tasks.every((a) => typeof(a) == 'number');

    if (!valid)
        res.status(400).send("Bad parameters");
    else if (!req.params.tg_id || isNaN(parseInt(req.params.tg_id)))
        res.status(400).send("Invalid ID");
    else {
        DB.edit_data((data) => {
            if (!data.task_groups || !data.task_groups[req.params.tg_id])
                res.status(404).send("No such Task Group");
            else {
                new_tg = param;
                new_tg.id = parseInt(req.params.tg_id);
                data.task_groups[req.params.tg_id] = new_tg;
                res.status(200).send('' + next_id);
            }
        });
    }
}

function create_tg(req, res) {
    let valid = true, param = req.body;
    valid &= param.name != undefined && typeof(param.name) == 'string';
    valid &= param.tasks != undefined && Array.isArray(param.tasks) &&
             param.tasks.every((a) => typeof(a) == 'number');

    if (!valid)
        res.status(400).send("Bad parameters");
    else {
        DB.edit_data((data) => {
            if (!data.task_groups) data.task_groups = { task_groups_next_id: 0 };
            next_id = data.task_groups.task_groups_next_id++;
            new_tg = param;
            new_tg.id = next_id;
            data.task_groups[next_id] = new_tg;
        });

        res.status(201).send('' + next_id);
    }
}

function delete_tg(req, res) {
    if (!req.params.tg_id || isNaN(parseInt(req.params.tg_id)))
        res.status(400).send("Invalid ID");
    else {
        DB.edit_data((data) => {
            if (data.task_groups && data.task_groups[req.params.tg_id]) {
                delete data.task_groups[req.params.tg_id];
                res.status(200).send();
            } else
                res.status(404).send("No such Task Group");
        });
    }
}

module.exports = { register_endpoints };
