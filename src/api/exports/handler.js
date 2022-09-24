const ClientError = require('../exceptions/ClientError');

class ExportHandler {
    constructor(service, playlistService, validator) {
      this._service = service;
      this._playlistService = playlistService;
      this._validator = validator;
   
      this.postExportsPlaylistHandler = this.postExportsPlaylistHandler.bind(this);
    }
   async postExportsPlaylistHandler(request, h) {
      const {id:playlistId} = request.params
        try {
            this._validator.validateExportsSongPlaylistPayload(request.payload);
            const message = {
                userId : request.auth.credentials.id,
                targetEmail: request.payload.targetEmail
            }
            await this._playlistService.verifyPlaylistOwner(playlistId, message.userId);


            await this._service.sendMessage("export:playlist", JSON.stringify(message));

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil di eksport',
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
  module.exports = ExportHandler;