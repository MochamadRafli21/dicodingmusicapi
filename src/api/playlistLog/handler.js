class PlaylistLogHandler {
    constructor(playlistLogService, playlistService) {
      this._service = playlistLogService;
      this._playlistService = playlistService;
   
      this.getPlaylistLogHandler = this.getPlaylistLogHandler.bind(this);
    }
      async getPlaylistLogHandler(request, h) {
            const { id } = request.params;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistOwner(id, credentialId)
            const playlists = await this._service.getPlaylistsLog(id);
            return {
              status: 'success',
              data: playlists,
            };
      }
    
  }
  module.exports = PlaylistLogHandler;