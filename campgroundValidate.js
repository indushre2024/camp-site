const Joi = require('joi');
const sanitizeHtml = require('sanitize-html');

// const customJoi = baseJoi.extend((joi) => ({
//     type: 'string',
//     base: joi.string(),
//     messages: {
//         'string.escapeHtml': '{{#label}} must not include HTML!'
//     },
//     rules: {
//         escapeHtml: {
//             validate(value, helpers) {
//                 const clean = sanitizeHtml(value, {
//                     allowedTags: [],
//                     allowedAttributes: {}
//                 });
//                 if (clean !== value) {
//                     return helpers.error('string.escapeHtml', { value });
//                 }
//                 return clean;
//             }
//         }
//     }
// }));

// const Joi = baseJoi.extend(customJoi);

module.exports.campgroundValidationSchema = Joi.object({
    campground:Joi.object({
        title:Joi.string().required(),
        location:Joi.string(),
        description:Joi.string().required(),
        price:Joi.number().required().min(0)

    }).required(),
    deletes:Joi.array()

})

module.exports.reviewValidationSchema = Joi.object({
    review: Joi.object({
        rating:Joi.number().required(),
        body: Joi.string().required()
    }).required()
})