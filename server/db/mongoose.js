var mongoose = require('mongoose');

// Set mongoose to use built-in JS promise
// instead of third-party libraries like Bluebird
mongoose.Promise = global.Promise;

mongoose.connect(process.env.MONGODB_URI);

module.exports = {mongoose};