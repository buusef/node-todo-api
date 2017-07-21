require('./config/config');
const express = require('express');
const bodyParser = require('body-parser');
const _ = require('lodash');
const {ObjectID} = require('mongodb');
var {mongoose} = require('./db/mongoose');
var {Todo} = require('./models/todo');
var {User} = require('./models/user');
var {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT;
var app = express();

app.use(bodyParser.json());

app.post('/todos', authenticate,(req, res) => {
    var todo = new Todo(
    {
        text: req.body.text,
        _creator: req.user._id
    });
    todo.save().then((doc)=>{
        res.send(doc);
    }, (err) => {
       res.status(400).send(err);
    })
});

app.get('/todos', authenticate,(req, res)=> {
    Todo.find(
        {
            _creator: req.user._id
        }
    ).then((todos)=>{
        res.send({todos});
    },(err)=>{
        res.status(400).send(e);
    })
})
app.get('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)) return res.status(404).send('Not a valid ID');
    Todo.findOne({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo) res.status(404).send('Todo not found');
        res.send({todo});
    }, (err)=>{
        res.status(400).send('Not a valid ID');
    });
});

app.delete('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    if(!ObjectID.isValid(id)) return res.status(404).send();
    Todo.findOneAndRemove({
        _id: id,
        _creator: req.user._id
    }).then((todo)=>{
        if(!todo) return res.status(404).send('Todo not found');
        res.send({todo});
    },(err)=>{
        res.status(400).send('Invalid');
    })
})

app.patch('/todos/:id', authenticate, (req,res)=>{
    var id = req.params.id;
    var body = _.pick(req.body, ['text', 'completed']);

    if(!ObjectID.isValid(id)) return res.status(404).send();
    if(_.isBoolean(body.completed) && body.completed) {
        body.completedAt = new Date().getTime();
    } else {
        body.completed = false;
        body.completedAt = null
    }
    // Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo)=>{
    //     if(!todo) return res.status(404).send();
    //     res.send({todo});
    Todo.findOneAndUpdate(
    {
        _id: id,
        _creator: req.user._id,
    },
    {
        $set: body
    },
    {
        new: true
    }).then((todo)=>{
    if(!todo) return res.status(404).send();
    res.send({todo});
    }).catch((e)=>res.status(404).send());
})

app.post('/users', (req,res)=>{
    var body = _.pick(req.body, ['email','password']);

    var user = new User(body);
    user.save().then(()=>{
        return user.generateAuthToken();        
    }).then((token)=>{
        res.header('x-auth', token).send(user);
    })
    .catch((e)=>{
        res.status(400).send();
    });
})



app.get('/users/me', authenticate, (req,res)=>{
    res.send(req.user);
})

app.post('/users/login',(req,res)=>{
    var body = _.pick(req.body, ['email','password']);
    var email = body.email;
    var password = body.password;

    User.findByCredentials(email,password).then((user)=>{
        return user.generateAuthToken().then((token)=>{
            res.header('x-auth', token).send(user);
        })
    }).catch((e)=>{
        res.status(401).send();
    });
});

app.delete('/users/me/token', authenticate, (req,res)=>{
    req.user.removeToken(req.token).then(()=>{
        res.status(200).send();
    }).catch((e)=>{
        res.status(400).send();
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