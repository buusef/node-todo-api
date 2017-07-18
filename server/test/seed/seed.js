const {Todo} = require('./../../models/todo');
const {User} = require('./../../models/user');
const {ObjectID} = require('mongodb');
const jwt = require('jsonwebtoken');

const userOneId = new ObjectID();
const userTwoId = new ObjectID();
const users = [{
    _id: userOneId,
    email: 'ahmad@ahmad.com',
    password: 'myPassword1',
    tokens: [{
        access: 'auth',
        token: jwt.sign({_id: userOneId, access: 'auth'}, 'SecretValue').toString()
    }]
},{
    _id: userTwoId,
    email: 'ahmad@example.com',
    password: 'myPassword2'
}];

const todos = [{
    _id: new ObjectID(),
    text: 'First test todo'
}, {
    _id: new ObjectID(),
    text: 'Second test todo',
    completed: true,
    completedAt: 333
}];

const populateTodos = (done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos);
  }).then(() => done());
};

const populateUsers = (done) => {
    User.remove({}).then(()=>{
        var userOne = new User(users[0]).save();
        var userTwo = new User(users[1]).save();
        //promise all will wait for promisses to complete
        return Promise.all([userOne, userTwo]);
    }).then(()=>done());
}

module.exports = {todos, populateTodos, users, populateUsers}