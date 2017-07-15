const {ObjectID} = require('mongodb')
const {mongoose} = require('./../server/db/mongoose');
const {Todo} = require('./../server/models/todo');
const {User} = require('./../server/models/user');

// Todo.remove({}).then((docs)=>{
//     console.log(docs);
// });

Todo.findOneAndRemove({_id: '596a1b6b69c42517c290ad64'}).then((doc)=>{
    console.log(doc);
});
Todo.findByIdAndRemove('596a1b6b69c42517c290ad64').then((doc)=>{
    console.log(doc);
});