process.env.NODE_ENV = "test"
const app = require('../server');
const request = require('supertest');
const config = require("../config/auth.config");
var jwt = require("jsonwebtoken");

var token = jwt.sign({ id: 1 }, config.secret, {
    expiresIn: config.jwatExpiresIn // 24 hours
});

let towerId = null;

//3
//Tower listing test
describe('GET /api/towers', function () {
    it('respond with json containing a list of all towers', function (done) {
        request(app)
            .get('/api/towers')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

//4
//Tower listing with offices test
describe('GET /api/towers?show-with-offices=true', function () {
    it('respond with json containing a list of all towers with offices', function (done) {
        request(app)
            .get('/api/towers?show-with-offices=true')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

//5
//Tower listing with paigination and search with multi fields and sorting order and select fields like GraphQL
describe('Search Towers /api/towers?name=X2&location=JLT&page=0&size=5&sortBy=id&sortOrder=asc&attributes=id,name,location', function () {
    it('respond with json containing a list of all towers with search, pagination, sorting, selected fields', function (done) {
        request(app)
            .get('/api/towers?name=X2&location=JLT&page=0&size=5&sortBy=id&sortOrder=asc&attributes=id,name,location')
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200, done);
    });
});

//6
//Create Tower
describe('Create /api/towers', function() {
    it('It shuold post the tower info', function (done) {
        request(app)
            .post('/api/towers')
            .send({
                name: Math.random().toString(36).replace('.',''),
                location:'Cluster F, JLT, Dubai, United Arab Emirates',
                number_of_floors:32,
                number_of_offices:800,
                rating:3.5,
                latitude:25.217656,
                longitude:55.283544,
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201)
            .end(function(err, res) {
                towerId = res.body.id;
                done();
            });
    });
});

//7
//Get Tower
describe('Get /api/towers', function() {
    it('It shuold get the tower info', function (done) {
        request(app)
            .get('/api/towers/'+towerId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201, done)
    });
});

//8
//Update Tower
describe('Update /api/towers', function() {
    it('It shuold post the tower info', function (done) {
        request(app)
            .patch('/api/towers/'+towerId)
            .send({
                name: Math.random().toString(36).replace('.',''),
            })
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201, done)
    });
});

//9
//Delete Tower
describe('Delete /api/towers', function() {
    it('It shuold delete the tower', function (done) {
        request(app)
            .delete('/api/towers/'+towerId)
            .set('Accept', 'application/json')
            .set('Authorization', 'Bearer ' + token)
            .expect('Content-Type', /json/)
            .expect(201, done)
    });
});