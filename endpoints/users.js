function register_endpoint(app) {
    app.get('/users', create_user);
}

function create_user(req, res) {
    res.send('Create user function');
}

module.exports = {register_endpoint, create_user};