const { PlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../api/exceptions/InvariantError')

const PlaylistValidator = {
    validatePlaylistPayload: (payload) => {
        const validationResult = PlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = PlaylistValidator;
