class AlbumsHandler {
    constructor(uploadsService, AlbumsService,UploadValidator) {
      this._service = uploadsService;
      this._albumsService = AlbumsService;
      this._uploadsValidator = UploadValidator;
   
      this.postCoverAlbumHandler = this.postCoverAlbumHandler.bind(this);
    }
    async postCoverAlbumHandler(request, h){
        const { id } = request.params;
        const { cover } = request.payload;
        await this._uploadsValidator.validateImageHeader(cover.hapi.headers);
        
        const filename = await this._service.writeFile(cover, cover.hapi);
        const fileLocation= `http://${process.env.HOST}:${process.env.PORT}/images/${filename}`

        await this._albumsService.editAlbumCoverById(id, fileLocation);
    
        const response = h.response({
            status: 'success',
            message: "Sampul berhasil diunggah"
        });
        response.code(201);
        return response;
    }
    
  }
  module.exports = AlbumsHandler;