const ClientError = require('../exceptions/ClientError');

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
        try {
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
        try {
          const { id } = request.params;
          const song = await this._service.getSongById(id);
          return {
            status: 'success',
            data: {
              song,
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
     
      async putSongByIdHandler(request, h) {
        try {
          await this._validator.validateSongPayload(request.payload);
          const { title, year, genre, performer, albumId, duration } = request.payload;
          const { id } = request.params;
     
          await this._service.editSongById(id, {title, year, genre, performer, albumId, duration});
     
          return {
            status: 'success',
            message: 'Lagu berhasil diperbarui',
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
     
      async deleteSongByIdHandler(request, h) {
        try {
          const { id } = request.params;
          await this._service.deleteSongById(id);
     
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
  module.exports = SongsHandler;