const db = require("../../models");
const Tower = db.towers;
const Office = db.offices;
const Op = db.Sequelize.Op;

const ERROR_MESSAGE = 'Something went wrong.'

const { body, param, validationResult } = require('express-validator/check');

exports.validate = (method) => {
  switch (method) {
    case 'createOfficeValidation': {
     	return [ 
        body('towerId', "Tower Id required").exists().isInt().trim().escape(),
        body('office_number', "Office number required").exists().trim().escape().custom(reqOfficeNumber=> {
          return new Promise((resolve, reject) => {
            Office.findOne({ where: { office_number: reqOfficeNumber } })
            .then(isExist => {
              if(isExist !== null){
                reject(new Error('Office already exists.'))
              }else{
                resolve(true)
              }
            })
          })
        }),
        body('rent').optional().trim().escape(),
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

    const office = {
      towerId: req.body.towerId,
      office_number: req.body.office_number,
      rent: req.body.rent || 0
    };

     Office.create(office)
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

exports.findAll = (req, res) => {
  try{
  	//Filters
   
    let condition = {};
    if(req.query.towerId){
      condition.towerId = req.query.towerId
    }
    if(req.query.office_number){
      const office_number = req.query.office_number;
      condition.office_number = { [Op.like]: `%${office_number}%` }
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
    const getAttributes = req.query.attributes ? req.query.attributes.split(',') : ['id', 'office_number', 'rent', 'towerId', 'createdAt'];

    Office.findAndCountAll({ where: condition, attributes:getAttributes, order:sortingOrder, limit, offset,})
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
    Office.findByPk(id)
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
  	Office.update(req.body, {
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
        return res.send({
          message: "Office was updated successfully."
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
  	Office.destroy({
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
        return res.send({
          message: "Office was deleted successfully!"
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
  const { count: totalItems, rows: offices } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, offices, totalPages, currentPage };
}
