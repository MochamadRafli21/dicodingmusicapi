const ClientError = require('../exceptions/ClientError');

class PlaylistHandler {
    constructor(playlistLogService, playlistService) {
      this._service = playlistLogService;
      this._playlistService = playlistService;
   
      this.getPlaylistLogHandler = this.getPlaylistLogHandler.bind(this);
    }
      async getPlaylistLogHandler(request, h) {
        try {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistOwner(id, credentialId)
            const playlists = await this._service.getPlaylistsLog(id);
            return {
              status: 'success',
              data: playlists,
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