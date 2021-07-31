const Joi = require('joi');


module.exports.volunteerValidation = Joi.object({
    volunteer: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        phone: Joi.number().required()
    
    }).required()
    
});