const { SongPayloadSchema } = require('./schema');
const InvariantError = require('../../api/exceptions/InvariantError')

const SongsValidator = {
    validateSongPayload: (payload) => {
        const validationResult = SongPayloadSchema.validate(payload);
        console.log(validationResult)
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = SongsValidator;
