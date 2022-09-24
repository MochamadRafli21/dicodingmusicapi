class PlaylistSongsHandler {
    constructor(playlistSongsService, playlistService, songsService, validator) {
      this._service = playlistSongsService;
      this._playlistService = playlistService;
      this._songsService = songsService;
      this._validator = validator;
   
      this.postPlaylistSongsHandler = this.postPlaylistSongsHandler.bind(this);
      this.getPlaylistSongsHandler = this.getPlaylistSongsHandler.bind(this);
      this.deletePlaylistSongsHandler = this.deletePlaylistSongsHandler.bind(this);
    }
   async postPlaylistSongsHandler(request, h) {
            this._validator.validatePlaylistSongsPayload(request.payload);
            const { id:playlistId } = request.params;
            const { songId } = request.payload;

            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess(playlistId, credentialId);
            await this._songsService.getSongById(songId);

            const resid = await this._service.addPlaylistSongs(playlistId, songId, credentialId);

            const response = h.response({
                status: 'success',
                message: 'Lagu berhasil ditambahkan',
                data: {
                    playlistSongsId: resid,
                },
              });
              response.code(201);
              return response;
      }
     
      async getPlaylistSongsHandler(request, h) {
            this._validator.validatePlaylistSongsPayload(request.payload);
            const { id:playlistId } = request.params;

            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess(playlistId, credentialId)
            const result = await this._service.getPlaylistSongs(playlistId);

            return {
              status: 'success',
              data: {
                playlist: result,
              },
            };
      }
     
      async deletePlaylistSongsHandler(request, h) {
          this._validator.validatePlaylistSongsPayload(request.payload);

            const { id } = request.params;
            const { songId } = request.payload;
            const { id: credentialId } = request.auth.credentials;
            await this._playlistService.verifyPlaylistAccess(id, credentialId)
            await this._service.deletePlaylistSongs(id, songId, credentialId);
    
            return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
            };

      }
    
  }
  module.exports = PlaylistSongsHandler;