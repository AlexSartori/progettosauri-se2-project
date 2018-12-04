const DB = require('../DinoBase');

function register_endpoints(app) {
    // app.get('/task_groups', get_all_tgs);
    app.get('/task_groups/:tg_id', get_tg);
    app.post('/task_groups', create_tg);
}

function get_tg(req, res) {
    if (!req.params.tg_id || isNaN(parseInt(req.params.tg_id)))
        res.status(400).send("Invalid ID");
    else {
        DB.edit_data((data) => {
            if (data.task_groups && data.task_groups[req.params.tg_id])
                res.status(200).send(data.task_groups[req.params.tg_id]);
            else
                res.status(404).send("No such exam");
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


module.exports = { register_endpoints };
