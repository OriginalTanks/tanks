var exports = module.exports = {};
var mongoose = require('mongoose');
var Users = mongoose.model('Users');


// register a user
exports.register = function (req, res) {
    // find or create the user with the given username
    Users.findOrCreate({username: req.body.username}, function(err, user, created) {
        if (created) {
            // if this username is not taken, then create a user record
            user.set_password(req.body.password);
            user.save(function(err) {
                if (err) {
                    res.sendStatus("403");
                    return;
                }
                // create a token
                var token = Users.generateToken(user.username);
                // return value is JSON containing the user's token
                res.json({token: token, username: user.username});
            });
        } else {
            // return an error if the username is taken
            res.sendStatus("403");
        }
    });
};

// login a user
exports.login = function (req, res) {
    // find the user with the given username
    Users.findOne({username: req.body.username}, function(err,user) {
    if (err) {
        res.sendStatus(403);
        return;
    }
        // validate the user exists and the password is correct
        if (user && user.checkPassword(req.body.password)) {
            // create a token
            var token = Users.generateToken(user.username);
            // return value is JSON containing user's token
            res.json({token: token, username: user.username});
        } else {
            res.sendStatus(403);
        }
    });
};
