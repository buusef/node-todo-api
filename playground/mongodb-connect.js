// const MongoClient = require('mongodb').MongoClient;

//using ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error) {
        //use return to break the function and prevent running the other conlose log or you can just use else
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB sever');
    // db.collection('Todos').insertOne({
    //     text: 'Something to do',
    //     completed: false
    // }, (err, result) => {
    //     if(err) {
    //         return console.log('Unable to insert todo', err);
    //     }
    //     console.log(JSON.stringify(result.ops, undefined, 4))
    // });


// db.collection('Users').insertOne({
//     name: 'Ahmad',
//     age: 30,
//     location: 'Kuwait'
// }, (err, result) => {
//     if(err) {
//         return console.log('Something went wrong', err);
//     }
//     console.log(result.ops[0]._id.getTimestamp());
// });

    db.close();
});