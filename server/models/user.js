var mongoose = require('mongoose');

var User = mongoose.model('users',
{
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1
    },
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 1

    }
});

module.exports = {User};