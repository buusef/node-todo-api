const {ObjectID} = require('mongodb');
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

User.findById('59693933cae9588627c8181b')
.then((user)=>{
    if(!user){
        return console.log('User not found');
    }
    console.log(user);
})
.catch((e)=>{
    console.log('Invalid ID');
});

// var id = '69693000da0df4085ecb078911';

// if(!ObjectID.isValid(id)) {
//     console.log('ID not valid');
// }

// Todo.find({
//     _id: id
// }).then((todos)=>{
//     console.log('Todos', todos);
// });

// Todo.findOne({
//     _id: id
// }).then((todo)=>{
//     console.log('Todo1', todo);
// });

// Todo.findById(id).then((todos)=>{
//     if(!todos) {
//         return console.log('Id not found');
//     }
//     console.log('Todo2', todos);
// }).catch((e)=> console.log(e));