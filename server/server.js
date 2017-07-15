const express = require('express');
const bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {ObjectID} = require('mongodb');
var port = process.env.PORT || 3000;
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
app.get('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)) return res.status(404).send('Not a valid ID');
    Todo.findById(id).then((todo)=>{
        if(!todo) res.status(404).send('Todo not found');
        res.send({todo});
    }, (err)=>{
        res.status(400).send('Not a valid ID');
    });
});

app.delete('/todos/:id', (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid) return res.status(404).send();
    Todo.findByIdAndRemove(id).then((doc)=>{
        if(!doc) return res.status(404).send('User not found');
        res.send(doc);
    },(err)=>{
        res.status(400).send('Invalid');
    })
})

app.listen(port, () => {
    console.log('Started on port '+port);
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