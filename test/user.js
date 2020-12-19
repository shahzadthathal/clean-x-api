process.env.NODE_ENV = "test"
const app = require('../server');
const request = require('supertest');

let randName = Math.random().toString(36).replace('.','');
let email = randName+"@app.com";
let password = "12345678"

//1
//User Register test
describe('POST /api/users/register', function() {
    it('it sould post the user info', function(done) {
      request(app)
        .post('/api/users/register')
        .send({
            full_name: randName,
            email: email,
            password: password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});

//2
//User Login test
describe('POST /api/users/login', function() {
    it('it sould post the user login info', function(done) {
      request(app)
        .post('/api/users/login')
        .send({
            email: email,
            password: password
        })
        .set('Accept', 'application/json')
        .expect('Content-Type', /json/)
        .expect(201)
        .end(function(err, res) {
            if (err) return done(err);
            done();
        });
    });
});
