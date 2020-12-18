const db = require("../../models");
const Tower = db.towers;
const Office = db.offices;
const Op = db.Sequelize.Op;

const ERROR_MESSAGE = 'Something went wrong.'
const config = require("../../config/auth.config");

const socketConfig = require("../../config/socket.config");
const io = require('../lib/socket')

const { body, check, query, param, validationResult } = require('express-validator/check')

exports.validate = (method) => {
  switch (method) {
    case 'createTowerValidation': {
     	return [ 
        body('name', "Name required").exists().trim().escape().custom(reqName=> {
          return new Promise((resolve, reject) => {
            Tower.findOne({ where: { name: reqName } })
            .then(isExist => {
              if(isExist !== null){
                reject(new Error('Tower already exists.'))
              }else{
                resolve(true)
              }
            })
          })
        }),
        body('location', 'Location required').exists().trim().escape(),
        body('number_of_floors', "Number of floors required").exists().isInt().trim().escape(),
        body('number_of_offices', "Number of offices required").exists().isInt().trim().escape(),
        body('rating').optional().trim().escape(),
        body('latitude', "Latitude required").exists().trim().escape(),
        body('longitude', "Longitude required").exists().trim().escape(),
      ]
    }
    case 'checkParamsIdValidation': {
        return [
          param('id', "Id required").exists().isInt(),
        ]
    }
  }
}

exports.create = (req, res) => {
  
  try{
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        res.status(422).json({ errors: errors.array() });
        return;
      }

      const tower = {
        name: req.body.name,
        location: req.body.location,
        number_of_floors: req.body.number_of_floors,
        number_of_offices: req.body.number_of_offices,
        rating: req.body.rating,
        latitude:  req.body.latitude,
        longitude: req.body.longitude,
      };

      Tower.create(tower)
      .then(data => {
        let payload = {
          'message':socketConfig.EVENT_TOWER_CREATED_MESSAGE
        }
        io.emitToAll(socketConfig.EVENT_TOWER_CREATED,payload)
          
        return res.send(data);
      })
      .catch(err => {
        return res.status(500).send({
          message: err.message || ERROR_MESSAGE
        });
      });

  }catch(err){
    return res.status(500).send({ message: err.message || ERROR_MESSAGE });
  }
}

exports.findAll = (req, res) => {
  try{
  	//Filters
    const name = req.query.name;

    let condition = {};
    if(req.query.name){
      const name = req.query.name;
      condition.name = { [Op.like]: `%${name}%` }
    }
    if(req.query.location){
      const location = req.query.location;
      condition.location = { [Op.like]: `%${location}%` }
    }
    if(req.query.location){
      const location = req.query.location;
      condition.location = { [Op.like]: `%${location}%` }
    }
    if(req.query.number_of_offices){
      const number_of_offices = req.query.number_of_offices;
      condition.number_of_offices = number_of_offices
    }
    if(req.query.number_of_floors){
      const number_of_floors = req.query.number_of_floors;
      condition.number_of_floors = number_of_floors
    }
    if(req.query.rating){
      const rating = req.query.rating;
      condition.rating = rating
    }

    //Pagination
    const page  = req.query.page || 0;
    const size  = req.query.size || 10;
    const { limit, offset } = getPagination(page, size);

    //Sorting
    const sortBy   = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'ASC';
    const sortingOrder = [[sortBy, sortOrder]];
    
    //Get specific fields, Pass comma separated fields
    const getAttributes = req.query.attributes ? req.query.attributes.split(',') : ['id', 'name', 'location', 'number_of_floors', 'number_of_offices','rating','latitude','longitude','createdAt'];


    //show-with-offices


    Tower.findAndCountAll({ where: condition, attributes:getAttributes, order:sortingOrder, limit, offset, 
    	//include:['offices']
    })
    .then(data => {
    	const paginateData = getPagingData(data, page, limit);
      	return res.send(paginateData);
    })
    .catch(err => {
      return res.status(500).send({
      	message: err.message || ERROR_MESSAGE
      });
    });
  
  }catch(err){
    return res.status(500).send({ message: err.message || ERROR_MESSAGE });
  }

}

exports.findOne = (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }
    const id = req.params.id;
    Tower.findByPk(id)
    .then(data => {
      return res.send(data);
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || ERROR_MESSAGE
      });
    });
  }catch(err){
    return res.status(500).send({ message: err.message || ERROR_MESSAGE });
  }
}

exports.update = (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

  	const id = req.params.id;
  	Tower.update(req.body, {
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
        
        let payload = {
          'message':socketConfig.EVENT_TOWER_UPDATED_MESSAGE
        }
      	io.emitToAll(socketConfig.EVENT_TOWER_UPDATED,payload)

        return res.send({
          message: "Tower was updated successfully."
        });
      } else {
        return res.send({
          message: ERROR_MESSAGE
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || ERROR_MESSAGE
      });
    });

  }catch(err){
    return res.status(500).send({ message: err.message || ERROR_MESSAGE });
  }

}

exports.delete = (req, res) => {
  try{
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(422).json({ errors: errors.array() });
      return;
    }

  	const id = req.params.id;
  	Tower.destroy({
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
      	
      	io.emitToAll(socketConfig.EVENT_TOWER_DELETED,{message:'Tower deleted', 'id':id})

        return res.send({
          message: "Tower was deleted successfully!"
        });
      } else {
        return res.send({
         message: ERROR_MESSAGE
        });
      }
    })
    .catch(err => {
      return res.status(500).send({
        message: err.message || ERROR_MESSAGE
      });
    });
  }catch(err){
    return res.status(500).send({ message: err.message || ERROR_MESSAGE });
  }
}

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
}

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: towers } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, towers, totalPages, currentPage };
}
