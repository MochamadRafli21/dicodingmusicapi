const { ExportsSongPlaylistPayloadSchema } = require('./schema');
const InvariantError = require('../../api/exceptions/InvariantError')

const ExportsSongPlaylistValidator = {
    validateExportsSongPlaylistPayload: (payload) => {
        const validationResult = ExportsSongPlaylistPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = ExportsSongPlaylistValidator;
