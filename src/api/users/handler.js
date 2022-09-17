const ClientError = require('../exceptions/ClientError');

class SongsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
   
      this.postUserHandler = this.postUserHandler.bind(this);
    }
   async postUserHandler(request, h) {
        try {
          await this._validator.validateUserPayload(request.payload);
          const { username, password, fullname } = request.payload;
     
          const userId = await this._service.addUser({ username, password, fullname });
     
          const response = h.response({
            status: 'success',
            message: 'User berhasil didaftarkan',
            data: {
                userId,
            },
          });
          response.code(201);
          return response;

        } catch (error) {
          if (error instanceof ClientError) {
            const response = h.response({
              status: 'fail',
              message: error.message,
            });
            response.code(error.statusCode);
            return response;
          }
     
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          return response;
        }
      }
  }
  module.exports = SongsHandler;