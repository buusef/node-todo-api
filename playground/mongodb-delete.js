// const MongoClient = require('mongodb').MongoClient;

//using ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error) {
        //use return to break the function and prevent running the other conlose log or you can just use else
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB sever');

    // db.collection('Todos').deleteMany({text: 'Go to home'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').deleteOne({text: 'Go to home'}).then((result) => {
    //     console.log(result);
    // });

    // db.collection('Todos').findOneAndDelete({text: 'Go to home'}).then((result) => {
    //     console.log(result);
    // });

    db.collection('Users').findOneAndDelete({_id: new ObjectID("595f4dd290ca3807d69cb9f1")}).then((result)=>{
        console.log(JSON.stringify(result,undefined,2));
    }, (err)=>{
        console.log(err);
    });    
    db.close();
});