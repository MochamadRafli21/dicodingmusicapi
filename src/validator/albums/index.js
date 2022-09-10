const { AlbumPayloadSchema } = require('./schema');
const InvariantError = require('../../api/albums/exceptions/InvariantError')

const AlbumsValidator = {
    validateAlbumPayload: (payload) => {
        const validationResult = AlbumPayloadSchema.validate(payload);
        if (validationResult.error) {
            console.log(validationResult.error)
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = AlbumsValidator;
