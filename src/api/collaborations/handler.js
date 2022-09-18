const ClientError = require('../exceptions/ClientError');

class CollaborationsHandler {
    constructor(playlistSongsService, playlistService, validator) {
      this._service = playlistSongsService;
      this._playlistService = playlistService;
      this._validator = validator;
   
      this.postCollaborationsHandler = this.postCollaborationsHandler.bind(this);
      this.deleteCollaborationsHandler = this.deleteCollaborationsHandler.bind(this);
    }
   async postCollaborationsHandler(request, h) {
        try {
            this._validator.validateCollaborationsPayload(request.payload);
            const { playlistId, userId } = request.payload;

            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

            const resid = await this._service.addCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'User berhasil ditambahkan',
                data: {
                    collaborationId: resid,
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
     
      async deleteCollaborationsHandler(request, h) {
        try {
            this._validator.validateCollaborationsPayload(request.payload);
            const { playlistId, userId } = request.payload;

            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistOwner(playlistId, credentialId);

            const resid = await this._service.deleteCollaboration(playlistId, userId);

            const response = h.response({
                status: 'success',
                message: 'User berhasil dihapus',
                data: {
                    collaborationId: resid,
                },
              });
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
     
          // Server ERROR!
          const response = h.response({
            status: 'error',
            message: 'Maaf, terjadi kegagalan pada server kami.',
          });
          response.code(500);
          return response;
        }
      }
    
  }
  module.exports = CollaborationsHandler;