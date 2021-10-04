const BaseJoi = require('joi');
const sanitizeHTML = require('sanitize-html');

const extension = (joi) =>({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers){
                const clean = sanitizeHTML(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if(clean !== value) return helpers.error('string.escapeHTML', {value})
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension);


module.exports.volunteerValidation = Joi.object({
    volunteer: Joi.object({
        firstName: Joi.string().required().escapeHTML(),
        lastName: Joi.string().required().escapeHTML(),
        address: Joi.string().required().escapeHTML(),
        city: Joi.string().required().escapeHTML(),
        state: Joi.string().required().escapeHTML(),
        birthday: Joi.string().required(),
        personalID: Joi.string().required().escapeHTML(),
        licenseNR: Joi.string().required().escapeHTML(),
        phone: Joi.number().required()
    
    }).required()
    
});