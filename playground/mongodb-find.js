// const MongoClient = require('mongodb').MongoClient;

//using ES6 destructuring
const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (error, db) => {
    if(error) {
        //use return to break the function and prevent running the other conlose log or you can just use else
        return console.log('Unable to connect to mongodb server');
    }
    console.log('Connected to MongoDB sever');

    // db.collection('Todos').find({_id: new ObjectID('595f6db3dc5e57f96d8c5f64')}).toArray().then((docs) => {
    //     console.log('Todos');
    //     console.log(JSON.stringify(docs, undefined,2));
    // }, (err) => {
    //     console.log('Unable to fetch Todos', err);
    // });

    // db.collection('Todos').find().count().then((count) => {
    //     console.log('Todos count', count);
    // }, (err) => {
    //     console.log('Unable to fetch Todos', err);
    // });

    db.collection('Users').find({name: 'Ahmad'}).toArray().then((docs)=>{
        console.log(JSON.stringify(docs, undefined,2));
    },(err)=>{
        console.log(err);
    });

    db.close();
});