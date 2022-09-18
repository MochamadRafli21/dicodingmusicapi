const ClientError = require('../exceptions/ClientError');

class PlaylistHandler {
    constructor(playlistService, validator) {
      this._service = playlistService;
      this._validator = validator;
   
      this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
      this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
      this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }
   async postPlaylistHandler(request, h) {
        try {
            this._validator.validatePlaylistPayload(request.payload);
            const { name } = request.payload;
            const { id: credentialId } = request.auth.credentials;

            const id = await this._service.addPlaylist(name, credentialId);

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    playlistId: id,
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
     
      async getPlaylistHandler(request, h) {
        try {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._service.getPlaylists(credentialId);
            return {
              status: 'success',
              data: {
                playlists,
              },
            };
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
     
      async deletePlaylistHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._service.verifyPlaylistOwner(id, credentialId)
            await this._service.deletePlaylistById(id);
    
            return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
            };
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
  module.exports = PlaylistHandler;