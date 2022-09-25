class AlbumsHandler {
    constructor(AlbumsService, albumValidator) {
      this._service = AlbumsService;
      this._validator = albumValidator;
   
      this.postAlbumHandler = this.postAlbumHandler.bind(this);
      this.getAlbumsHandler = this.getAlbumsHandler.bind(this);
      this.getAlbumByIdHandler = this.getAlbumByIdHandler.bind(this);
      this.putAlbumByIdHandler = this.putAlbumByIdHandler.bind(this);
      this.deleteAlbumByIdHandler = this.deleteAlbumByIdHandler.bind(this);
      //albums like
      this.postAlbumLikesHandler = this.postAlbumLikesHandler.bind(this);
      this.getAlbumLikesByIdHandler = this.getAlbumLikesByIdHandler.bind(this);
    }
   async postAlbumHandler(request, h) {
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
          const { id } = request.params;
          const album = await this._service.getAlbumById(id);
          return {
            status: 'success',
            data: {
              album,
            },
          };
      }
     
      async putAlbumByIdHandler(request, h) {
          await this._validator.validateAlbumPayload(request.payload);
          const { name, year } = request.payload;
          const { id } = request.params;
     
          await this._service.editAlbumById(id, {name, year});
     
          return {
            status: 'success',
            message: 'Album berhasil diperbarui',
          };
      }
     
      async deleteAlbumByIdHandler(request, h) {
          const { id } = request.params;
          await this._service.deleteAlbumById(id);
     
          return {
            status: 'success',
            message: 'Album berhasil dihapus',
          };
      }

      async postAlbumLikesHandler(request, h){
        const { id } = request.params;
        const { id: credentialId } = request.auth.credentials;
        await this._service.getAlbumById(id)
        await this._service.addAlbumsLike(id, credentialId);
   
        const response = h.response({
          status: 'success',
          message: 'Likes berhasil di update',
        });
        response.code(201);
        return response;
      }

      async getAlbumLikesByIdHandler(request, h){
        const { id } = request.params;
        await this._service.getAlbumById(id)
        const result = await this._service.getAlbumsLike(id);
        const response = h.response({
          status: 'success',
          message: 'Likes berhasil di update',
          data:{
            likes: result.rowCount
          }
        });
        if(result.is_cache) response.header('X-Data-Source', 'cache');
        response.code(200);
        return response;
      }
    
  }
  module.exports = AlbumsHandler;