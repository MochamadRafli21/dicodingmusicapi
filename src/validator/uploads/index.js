const { ImageHeadersSchema } = require('./schema');
const InvariantError = require('../../api/exceptions/InvariantError')

const UploadValidator = {
    validateImageHeader: (payload) => {
        const validationResult = ImageHeadersSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UploadValidator;
