const Joi = require('joi');
 
const ExportsSongPlaylistPayloadSchema = Joi.object({
    targetEmail: Joi.string().email({tlds: true}).required()
});

module.exports = { ExportsSongPlaylistPayloadSchema };
