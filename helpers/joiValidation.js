const Joi = require('joi');


module.exports.volunteerValidation = Joi.object({
    volunteer: Joi.object({
        firstName: Joi.string().required(),
        lastName: Joi.string().required(),
        address: Joi.string().required(),
        city: Joi.string().required(),
        state: Joi.string().required(),
        birthday: Joi.string().required(),
        personalID: Joi.string().required(),
        licenseNR: Joi.string().required(),
        phone: Joi.number().required()
    
    }).required()
    
});