class ExportHandler {
    constructor(service, playlistService, validator) {
      this._service = service;
      this._playlistService = playlistService;
      this._validator = validator;
   
      this.postExportsPlaylistHandler = this.postExportsPlaylistHandler.bind(this);
    }
   async postExportsPlaylistHandler(request, h) {
        const {id:playlistId} = request.params
        this._validator.validateExportsSongPlaylistPayload(request.payload);
        const message = {
            userId : request.auth.credentials.id,
            playlistId: playlistId,
            targetEmail: request.payload.targetEmail
        }
        await this._playlistService.verifyPlaylistOwner(playlistId, message.userId);


        await this._service.sendMessage("export:playlist", JSON.stringify(message));

        const response = h.response({
            status: 'success',
            message: 'Permintaan Anda sedang kami proses',
          });
          response.code(201);
          return response;

      }
    
  }
  module.exports = ExportHandler;