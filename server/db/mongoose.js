var mongoose = require('mongoose');

// Set mongoose to use built-in JS promise
// instead of third-party libraries like Bluebird
mongoose.Promise = global.Promise;

mongoose.connect('mongodb://localhost:27017/TodoApp');

module.exports = {mongoose};