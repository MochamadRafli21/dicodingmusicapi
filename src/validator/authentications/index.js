const {    
    PostAuthenticationPayload,
    PutAuthenticationPayload,
    DeleteAuthenticationPayload
}= require('./schema')

const InvariantError = require('../../api/exceptions/InvariantError')

const AuthValidator = {
    validatePostAuthenticationPayload:(payload) => {
        const validateResult = PostAuthenticationPayload.validate(payload)
        if(validateResult.error){
            throw new InvariantError(validateResult.error.message)
        }
    },
    validatePutAuthenticationPayload:(payload) => {
        const validateResult = PutAuthenticationPayload.validate(payload)
        if(validateResult.error){
            throw new InvariantError(validateResult.error.message)
        }
    },
    validateDeleteAuthenticationPayload:(payload) => {
        const validateResult = DeleteAuthenticationPayload.validate(payload)
        if(validateResult.error){
            throw new InvariantError(validateResult.error.message)
        }
    },
}

module.exports = AuthValidator;