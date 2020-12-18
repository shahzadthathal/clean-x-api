const db = require("../../models");
const Tower = db.towers;
const Op = db.Sequelize.Op;

const ERROR_MESSAGE = 'Something went wrong.'


exports.create = (req, res) => {
  
   if (!req.body.name) {
	    return res.status(400).send({
	      message: "Content can not be empty!"
	    });   
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
	  return res.send(data);
	})
	.catch(err => {
	  return res.status(500).send({
	    message: err.message || ERROR_MESSAGE
	  });
	});

};

exports.findAll = (req, res) => {
  
  	//Filters
    const name = req.query.name;
    let condition = name ? { name: { [Op.like]: `%${name}%` }, location: { [Op.like]: `%${name}%` } } : null;
    
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

    Tower.findAndCountAll({ where: condition, attributes:getAttributes, order:sortingOrder, limit, offset  })
    .then(data => {
    	const paginateData = getPagingData(data, page, limit);
      	return res.send(paginateData);
    })
    .catch(err => {
      return res.status(500).send({
      	message: err.message || ERROR_MESSAGE
      });
    });

};

exports.findOne = (req, res) => {
  
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
};

exports.update = (req, res) => {
  	const id = req.params.id;
  	Tower.update(req.body, {
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
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

};

exports.delete = (req, res) => {
  	const id = req.params.id;
  	Tower.destroy({
    where: { id: id }
  	})
    .then(num => {
      if (num == 1) {
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
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: towers } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, towers, totalPages, currentPage };
};
