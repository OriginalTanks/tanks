var exports = module.exports = {}

var mongoose = require('mongoose');
var Games = mongoose.model('Games');
var Users = mongoose.model('Users');

exports.findAll = function (req, res) {
    Games.find({}, function(err, results) {
        return res.send(results);
    });
};

exports.findGamesByUsername = function (req, res) {
    var username = req.params.username;
    Users.findOne({'username': username}, function(err, result) {
        if (result === null || !result.tanks) {
            return res.send([]);
        }
        var userTankIds = [];
        for (var i = 0; i < result.tanks.length; i++) {
            userTankIds.push(result.tanks[i]._id);
        }
        Games.find({
            tankIds: { $in : userTankIds }
        }, function (error, results) {
            return res.send(results);
        });
    });
};

exports.listOpen = function (req, res) {
    Games.find({ 
        $or: [ 
            { $where: "this.tankIds.length < 4" }, 
            {tankIds: {$exists: false}}
    ]}, 
    function(err, results) {
        return res.send(results);
    });
};

exports.findById = function (req, res) {
    var gameid = req.params.gameid;
    Games.findById(gameid, function(err, result) {
        return res.send(result);
    });
};

exports.add = function (req, res) {
    Games.create(req.body, function (err, game) {
        if (err) return console.log(err);
        return res.send(game);
    });
};

exports.addTank = function (req, res) {
    var gameid = req.params.gameid;
    Games.findById(gameid, function(err, game) {
        var tank = req.body.tank;
        if (tank === undefined) {
            error = "Tank is undefined when trying to add to game";
            console.log(error);
            return res.status(400).send(error);
        }
        console.log(tank);
        game.tankIds.push(tank._id);
        if (game.tankIds.length >= 4) {
            game.ready = true;
            game.status = 0;
        }
        game.save(function (err) {
            if (err) return console.log(err);
            return res.send(game);
        });
    });
};

exports.listTanks = function (req, res) {
    var gameid = req.params.gameid;
    Games.findById(gameid, function(err, game) {
        return res.send(game.tanks);
    });
};

exports.delete = function (req, res) {
    var gameid = req.params.gameid;
    var tankid = req.params.tankid;
    Games.findById(gameid, function(err, game) {
        user.tanks.pull(tankid);
        if (err) return console.log(err);
        return res.sendStatus(202);
    })
};
