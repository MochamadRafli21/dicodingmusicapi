const { UserPayloadSchema } = require('./schema');
const InvariantError = require('../../api/exceptions/InvariantError')

const UserValidator = {
    validateUserPayload: (payload) => {
        const validationResult = UserPayloadSchema.validate(payload);
        if (validationResult.error) {
            throw new InvariantError(validationResult.error.message);
        }
    },
};

module.exports = UserValidator;
