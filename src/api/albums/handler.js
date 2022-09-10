const ClientError = require('../exceptions/ClientError');

class AlbumsHandler {
    constructor(service, validator) {
      this._service = service;
      this._validator = validator;
   
      this.postAlbumHandler = this.postAlbumHandler.bind(this);
      this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
      this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
      this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
      this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
    }
   async postAlbumHandler(request, h) {
        try {
          await this._validator.validateAlbumPayload(request.payload);
          const { name, year } = request.payload;
     
          const albumId = await this._service.addAlbum({ name, year });
     
          const response = h.response({
            status: 'success',
            message: 'Album berhasil ditambahkan',
            data: {
                albumId,
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
          console.error(error);
          return response;
        }
      }
     
      async getAlbumsHandler() {
        const albums = await this._service.getAlbums();
        return {
          status: 'success',
          data: {
            albums,
          },
        };
      }
     
      async getAlbumByIdHandler(request, h) {
        try {
          const { id } = request.params;
          const album = await this._service.getAlbumById(id);
          return {
            status: 'success',
            data: {
              album,
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
          console.error(error);
          return response;
        }
      }
     
      async putAlbumByIdHandler(request, h) {
        try {
          await this._validator.validateAlbumPayload(request.payload);
          const { name, year } = request.payload;
          const { id } = request.params;
     
          await this._service.editAlbumById(id, {name, year});
     
          return {
            status: 'success',
            message: 'Album berhasil diperbarui',
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
            console.error(error);
            return response;
        }
      }
     
      async deleteAlbumByIdHandler(request, h) {
        try {
          const { id } = request.params;
          await this._service.deleteAlbumById(id);
     
          return {
            status: 'success',
            message: 'Album berhasil dihapus',
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
          console.error(error);
          return response;
        }
      }
    
  }
  module.exports = AlbumsHandler;