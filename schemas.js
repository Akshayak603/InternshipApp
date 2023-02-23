const BaseJoi = require('joi');
const sanitizeHtml = require('sanitize-html');

const extension = (joi) => ({
    type: 'string',
    base: joi.string(),
    messages: {
        'string.escapeHTML': '{{#label}} must not include HTML!'
    },
    rules: {
        escapeHTML: {
            validate(value, helpers) {
                const clean = sanitizeHtml(value, {
                    allowedTags: [],
                    allowedAttributes: {},
                });
                if (clean !== value) return helpers.error('string.escapeHTML', { value })
                return clean;
            }
        }
    }
});

const Joi = BaseJoi.extend(extension)

module.exports.internSchema = Joi.object({
        intern: Joi.object({
        title: Joi.string().required().escapeHTML(),
        vac: Joi.number().required().min(1),
        image: Joi.string().required().escapeHTML(),
        location: Joi.string().required().escapeHTML(),
        link: Joi.string().required().escapeHTML(),
        lastDate:Joi.string().required(),
        description: Joi.string().required().escapeHTML()
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().required().min(1).max(5),
        body: Joi.string().required().escapeHTML()
    }).required()
})