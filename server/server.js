const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');

var app = express();

app.use(bodyParser.json());

app.post('/todos', (req, res) => {
    var todo = new Todo(
    {
        text: req.body.text
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (err) => {
       res.status(400).send(err);
    })
});

app.get('/todos', (req, res)=> {
    Todo.find().then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(e);
    })
})

app.listen(3000, () => {
    console.log('Started on port 3000');
});



module.exports = {app};
// var newTodo = new Todo(
//     {
//         text: 'Cook dinner'
//     }
// );

// newTodo.save().then((doc) => {
//     console.log('Saved todo', doc);
// }, (err) => {
//     console.log('Unable to save todo', err);
// });

// var newTodo = new Todo({
//         text: 'wa7ed',
//         completed: false,
//         completedAt: 123
//     }
// );



// newTodo.save().then((doc)=>{
//     console.log(JSON.stringify(doc, undefined,2));
// }, (err)=> {
//     console.log(err);
// });

// var newUser = new User({
//     email: 'ahmad@gmail.com',
//     name: 'Ahmad'
// });

// newUser.save().then((doc)=>{
//     console.log('User saved', doc);
// }, (err) => {
//     console.log(err);
// });