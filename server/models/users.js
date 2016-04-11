var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var findOrCreate = require('mongoose-findorcreate')

// setup bcrypt
var bcrypt = require('bcrypt');
var SALT = bcrypt.genSaltSync();

// setup json web token
var jwt = require('jsonwebtoken');
var SECRET = '\x1f\x1e1\x8a\x8djO\x9e\xe4\xcb\x9d`\x13\x02\xfb+\xbb\x89q"F\x8a\xe0a';

var TankSchema = new Schema({
    name: String,
    code: String
});

var UserSchema = new Schema({
    username: {type: String, index: true, unique: true},
    password_hash: String,
    tanks: [TankSchema]
});

// hash the password
UserSchema.methods.set_password = function(password) {
    //console.log("encrypting and setting a password hash: ");
    //console.log(password);
    //console.log(SALT);
    this.password_hash = bcrypt.hashSync(password, SALT);
};

// check the password
UserSchema.methods.checkPassword = function(password) {
    return bcrypt.compareSync(password, this.password_hash);
};

// Generate a token for a client
UserSchema.statics.generateToken = function(username) {
    return jwt.sign({ username: username }, SECRET);
};

// Verify the token from a client. Call the callback with a user object if successful or null otherwise.
UserSchema.statics.verifyToken = function(token, cb) {
    if (!token) {
        cb(null);
        return;
    }
    // decrypt the token and verify that the encoded user id is valid
    jwt.verify(token, SECRET, function(err, decoded) {
        if (!decoded) {
            cb(null);
            return;
        }
        User.findOne({username: decoded.username}, function(err, user) {
            if (err) {
                cb(null);
            } else {
                cb (user);
            }
        });
    });
};

// add findOrCreate
UserSchema.plugin(findOrCreate);

// create User
var User = mongoose.model('Users', UserSchema);
module.exports = User;

