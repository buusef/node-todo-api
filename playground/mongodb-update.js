// const MongoClient = require('mongodb').MongoClient;

//using ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error) {
        //use return to break the function and prevent running the other conlose log or you can just use else
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB sever');

    // db.collection('Todos').findOneAndUpdate(
    //     {
    //         _id: new ObjectID("595fc808dc5e57f96d8c776e")
    //     }, {
    //         $set: {
    //             completed: true
    //         }
    //     }, {
    //         returnOriginal: false
    // }).then((result) => {
    //     console.log(result);
    // });
    db.collection('Users').findOneAndUpdate(
        {
            _id: 123
        },
        {
            $inc: {
                age: 1
            }
        },
        {
            returnOriginal: false
        }
    ).then((result) => {
        console.log(result);
    });

    db.close();
});