class PlaylistHandler {
    constructor(playlistService, validator) {
      this._service = playlistService;
      this._validator = validator;
   
      this.postPlaylistHandler = this.postPlaylistHandler.bind(this);
      this.getPlaylistHandler = this.getPlaylistHandler.bind(this);
      this.deletePlaylistHandler = this.deletePlaylistHandler.bind(this);
    }
   async postPlaylistHandler(request, h) {
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
      }
     
      async getPlaylistHandler(request, h) {
            const { id: credentialId } = request.auth.credentials;
            const playlists = await this._service.getPlaylists(credentialId);
            return {
              status: 'success',
              data: {
                playlists,
              },
            };

      }
     
      async deletePlaylistHandler(request, h) {
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.verifyPlaylistOwner(id, credentialId)
        await this._service.deletePlaylistById(id);

        return {
        status: 'success',
        message: 'Lagu berhasil dihapus',
        };
      }
    
  }
  module.exports = PlaylistHandler;