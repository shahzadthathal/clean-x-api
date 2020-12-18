const db = require("../../models");
const Tower = db.towers;
const Office = db.offices;
const Op = db.Sequelize.Op;

const ERROR_MESSAGE = 'Something went wrong.'


exports.create = (req, res) => {
  
   if (!req.body.towerId || !req.body.office_number) {
	    return res.status(400).send({
	      message: "Content can not be empty!"
	    });   
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
    

};

exports.findAll = (req, res) => {
  
  	//Filters
    const office_number = req.query.office_number;
    let condition = office_number ? { office_number: { [Op.like]: `%${office_number}%` }, rent: { [Op.like]: `%${name}%` } } : null;
    
    //Pagination
    const page  = req.query.page || 0;
    const size  = req.query.size || 10;
    const { limit, offset } = getPagination(page, size);

    //Sorting
    const sortBy   = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder || 'ASC';
    const sortingOrder = [[sortBy, sortOrder]];
    
    //Get specific fields, Pass comma separated fields
    const getAttributes = req.query.attributes ? req.query.attributes.split(',') : ['id', 'office_number', 'rent', 'createdAt'];

    Office.findAndCountAll({ where: condition, attributes:getAttributes, order:sortingOrder, limit, offset, 
    	include:[{
        	model: db.tower
    	}]
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

};

exports.findOne = (req, res) => {
  
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
};

exports.update = (req, res) => {
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
};

exports.delete = (req, res) => {
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
};

const getPagination = (page, size) => {
  const limit = size ? +size : 3;
  const offset = page ? page * limit : 0;

  return { limit, offset };
};

const getPagingData = (data, page, limit) => {
  const { count: totalItems, rows: offices } = data;
  const currentPage = page ? +page : 0;
  const totalPages = Math.ceil(totalItems / limit);

  return { totalItems, offices, totalPages, currentPage };
};
