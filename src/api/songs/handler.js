class SongsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
   
      this.postSongHandler = this.postSongHandler.bind(this);
      this.getSongsHandler = this.getSongsHandler.bind(this);
      this.getSongByIdHandler = this.getSongByIdHandler.bind(this);
      this.putSongByIdHandler = this.putSongByIdHandler.bind(this);
      this.deleteSongByIdHandler = this.deleteSongByIdHandler.bind(this);
    }
   async postSongHandler(request, h) {
          await this._validator.validateSongPayload(request.payload);
          const { title, year, genre, performer, albumId, duration } = request.payload;
     
          const songId = await this._service.addSong({ title, year, genre, performer, albumId, duration });
     
          const response = h.response({
            status: 'success',
            message: 'Lagu berhasil ditambahkan',
            data: {
                songId,
            },
          });
          response.code(201);
          return response;
      }
     
      async getSongsHandler(request) {
        const { title, performer } = request.query;
        const songs = await this._service.getSongs(title, performer);
        return {
          status: 'success',
          data: {
            songs,
          },
        };
      }
     
      async getSongByIdHandler(request, h) {
          const { id } = request.params;
          const song = await this._service.getSongById(id);
          return {
            status: 'success',
            data: {
              song,
            },
          };
      }
     
      async putSongByIdHandler(request, h) {
          await this._validator.validateSongPayload(request.payload);
          const { title, year, genre, performer, albumId, duration } = request.payload;
          const { id } = request.params;
     
          await this._service.editSongById(id, {title, year, genre, performer, albumId, duration});
     
          return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
          };
      }
     
      async deleteSongByIdHandler(request, h) {
          const { id } = request.params;
          await this._service.deleteSongById(id);
     
          return {
            status: 'success',
            message: 'Lagu berhasil dihapus',
          };
      }
    
  }
  module.exports = SongsHandler;