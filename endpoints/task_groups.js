const DB = require('../DinoBase');

function register_endpoints(app) {
    app.post('/task_groups', create_tg);
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
