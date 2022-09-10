const Joi = require('joi');
 
const SongPayloadSchema = Joi.object({
  title: Joi.string().required(),
  year: Joi.number().required(),
  genre: Joi.string().required(),
  performer: Joi.string().required(),
  albumid: Joi.string(),
  duration: Joi.number(),
});

module.exports = { SongPayloadSchema };
