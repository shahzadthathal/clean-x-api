## Local setup
- Prerequisite
    - Make sure Redis server is intalled on your machine
    - sequelize-cli packages is installed 

- Git Clone
  - git clone https://github.com/shahzadthathal/clean-x-api.git

- Database config
    - Update database credentials in  /config/config.json
    - Run migration: npx sequelize-cli db:migrate
    - Run seeder: npx sequelize-cli db:seed:all

- Install dependencies
  - npm install

- Run
  - node server

- Info
  - API Url: http://localhost:5000/api/
  - Events emits to this client: http://localhost:5000/
  - Events are defined in config/socket.config.js
  - JWT config is defined in auth.config.js
  - Database schema describe image is under docs dir
  - forever-monitoer installed to avoid stop application in case of crash, I used try catch block but we must needs this kind of package to keep app running in case of someting bad happened.
  - Node cluster module also configured for high scalability and perfomance.

- API Endpoints
  - Register user : ```/api/users/register```  , POST parameters: ```full_name, email, password```
  - Login user: ```/api/users/login```, POST params: ```email, password```, it will return a auth token(JWT token) which you can use for later create tower and other secure routes usign POSTMAN Authorizaion Bearer token or x-access-token in headers
  - Create Tower: ```/api/towers```, POST params: ```name, location, number_of_floors, number_of_offices, rating, latitude, longitude```, Make sure you passed the token for authorization see Login user. It will emit an event to socket connected clients which you can see on: http://localhost:5000/
  - List All Towers: ```api/towers```, Method: GET
  - Update Tower: /api/towers/1, Method: PATCH, Params any field you want to update and token required for Authorization, will emit an event to notifiy to clients.
  - GET Tower: ```/api/towers/1```, Method: GET, return single tower
  - Delete Tower: ```/api/towers/1```, Method: DELETE
  - List All Towers with offices: ```/api/towers?show-with-offices=true```
  - Tower listing with paigination, search with multi fields and sorting order and select fields like GraphQL : ```/api/towers?name=X2&location=JLT&page=0&size=5&sortBy=id&sortOrder=asc&attributes=id,name,location```
  

- Run Test: 
  - BlackBox Testing :) There are 9 tests defined and after running this command you should see output: 9 passing (xxms)
  - npm test