const expect = require('expect');
const request = require('supertest');

const {app} = require('./../server');
const {Todo} = require('./../models/todo');
const {User} = require('./../models/user');
const {ObjectID} = require('mongodb');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
  it('should create a new todo', (done) => {
    var text = 'Test todo text';

    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      });
  });

  it('should not create todo with invalid body data', (done) => {
    request(app)
      .post('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .send({})
      .expect(400)
      .end((err, res) => {
        if (err) {
          return done(err);
        }

        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((e) => done(e));
      });
  });
});

describe('GET /todos', () => {
  it('should get all todos', (done) => {
    request(app)
      .get('/todos')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body.todos.length).toBe(1);
      })
      .end(done);
  });
});

describe('GET /todos/:id', ()=>{
    it('should return a todo', (done)=>{
        request(app)
        .get('/todos/'+todos[0]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toEqual(todos[0]._id);
            expect(res.body.todo.text).toBe(todos[0].text);

        })
        .end(done);
    })
    it('should not return a todo doc created by other users', (done)=>{
        request(app)
        .get('/todos/'+todos[1]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

    it('should return 404 if todo not found', (done) => {
        var hexId = new ObjectID().toHexString();
        request(app)
        .get('/todos/'+hexId)
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

    it('should return 404 for non-object ids', (done)=>{
        request(app)
        .get('/todos/abc123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

});

describe('DELETE /todos/:id', ()=>{
    it('should delete a todo', (done)=>{
        request(app)
        .delete('/todos/'+todos[1]._id.toHexString())
        .set('x-auth', users[1].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo._id).toEqual(todos[1]._id.toHexString())
        })
        .end((err,res)=>{
            if(err) return done(err);
            Todo.findById(todos[1]._id.toHexString()).then((doc)=>{
                expect(doc).toBe(null); 
                expect(doc).toNotExist();
                done();
            }).catch((err)=>done(err));
        });
    })
    it('should not delete a todo', (done)=>{
        request(app)
        .delete('/todos/'+todos[0]._id.toHexString())
        .set('x-auth', users[1].tokens[0].token)
        .expect(404)
        .end((err,res)=>{
            if(err) return done(err);
            Todo.findById(todos[0]._id.toHexString()).then((doc)=>{
                expect(doc).toExist();
                done();
            }).catch((err)=>done(err));
        });
    })
    it('should return 404 if todo not found', (done)=>{
        request(app)
        .delete('/todos/596a2ccf9f98a21f0b18af93')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })

    it('should return 404 if object is invalid', (done)=>{
        request(app)
        .delete('/todos/abc123')
        .set('x-auth', users[0].tokens[0].token)
        .expect(404)
        .end(done);
    })
})

describe('PATCH /todos/:id', ()=>{
    it('should update a todo', (done)=>{
        var text='It is completed';
        request(app)
        .patch('/todos/'+todos[0]._id.toHexString())
        .set('x-auth', users[0].tokens[0].token)
        .send({
            text,
            completed:true
        })
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(true);
            expect(res.body.todo.text).toBe(text);
            expect(res.body.todo.completedAt).toBeA('number');
        })
        .end((err,res)=>{
            if(err) return done(err);
            Todo.findById(todos[0]._id.toHexString())
            .then((doc)=>{
                if(!doc) return done();
                expect(doc.completed).toBe(true);
                done();
            })
            .catch((e)=>{
                done(e);
            });
        })
    });

    it('should not update a todo with different user', (done)=>{
        var text='It is completed';
        request(app)
        .patch('/todos/'+todos[0]._id.toHexString())
        .set('x-auth', users[1].tokens[0].token)
        .send({
            text,
            completed:true
        })
        .expect(404)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end((err,res)=>{
            if(err) return done(err);
            Todo.findById(todos[0]._id.toHexString())
            .then((doc)=>{
                if(!doc) return done();
                expect(doc.completed).toBe(false);
                done();
            })
            .catch((e)=>{
                done(e);
            });
        })
    });

    it('should clear completed at when todo is not completed', (done)=>{
        request(app)
        .patch('/todos/'+todos[1]._id.toHexString())
        .set('x-auth', users[1].tokens[0].token)
        .send({completed:false})
        .expect(200)
        .expect((res)=>{
            expect(res.body.todo.completed).toBe(false);
            expect(res.body.todo.completedAt).toNotExist();
        })
        .end(done);
    })
})

describe('GET /users/me',()=>{
    it('should return a user if authenticated',(done)=>{
        request(app)
        .get('/users/me')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .expect((res)=>{
            expect(res.body._id).toBe(users[0]._id.toHexString());
            expect(res.body.email).toBe(users[0].email);
        })
        .end(done);
    })

    it('should return 401 if not authenticated', (done)=>{
        request(app)
        .get('/users/me')
        //.set('x-auth', '')
        .expect(401)
        .expect((res)=>{
            expect(res.body).toEqual({});
        })
        .end(done);
    })
});


describe('POST /users', ()=>{
    it('should add new user', (done)=>{
        var email = 'wqe@wqe.qwe';
        var password = 'qwewerert';
        request(app)
        .post('/users')
        .send({
            email,
            password
        })
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
            expect(res.body.email).toBe(email);
            expect(res.body._id).toExist();
        })
        .end((err)=>{
            if(err) return done(err);
            User.findOne({email}).then((user)=>{
                expect(user).toExist();
                expect(user.password).toNotBe(password);
                done();
            }).catch((e)=>done(e));
        });
    });

    it('should return validation errors if request invalid',(done)=>{
        var email = 'wqewqe.qwe';
        var password = 'qwewerert';
        request(app)
        .post('/users')
        .send({email,password})
        .expect(400)
        .expect((res)=>{
            expect(res.body).toEqual({})
        })
        .end(done);
    });

    it('should not create user if email is in use',(done)=>{
        request(app)
        .post('/users')
        .send({email: users[0].email, password:'oiuyiuy'})
        .expect(400)
        .end(done);
    });
});

describe('POST /users/login', ()=>{
    it('should login user and return auth token', (done)=>{
        var email = users[1].email;
        var password = users[1].password;
        request(app)
        .post('/users/login')
        .send({email,password})
        .expect(200)
        .expect((res)=>{
            expect(res.headers['x-auth']).toExist();
        })
        .end((err, res)=>{
            if(err) return done(err);
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens[1]).toInclude({
                    access: 'auth',
                    token: res.headers['x-auth']
                });
                done();
            }).catch((e)=>done(e));
        });


    })

    it('should reject invalid login', (done)=>{
        var email = users[1].email;
        var password = users[1].password;
        request(app)
        .post('/users/login')
        .send({
            email,
            password: 'sadasdf'
        })
        .expect(401)
        .expect((res)=>{
            expect(res.headers['x-auth']).toNotExist();
        })
        .end((err, res)=>{
            if(err) return done(err);
            User.findById(users[1]._id).then((user)=>{
                expect(user.tokens.length).toBe(1);
                done();
            }).catch((e)=>done(e));
        });
    })
});

describe('DELETE /users/me/token', ()=>{
    it('should remove auth token on logout',(done)=>{
        request(app)
        .delete('/users/me/token')
        .set('x-auth', users[0].tokens[0].token)
        .expect(200)
        .end((err,res)=>{
            if(err) return done(err);
            User.findById(users[0]._id).then((user)=>{
                expect(user.tokens.length).toBe(0);
                done();
            }).catch((e)=>done(e));
        });
    })
})