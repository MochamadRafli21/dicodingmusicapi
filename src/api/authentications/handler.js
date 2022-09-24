class AuthHandler {
    constructor(authenticationsService, usersService, tokenManager, validator) {
      this._service = authenticationsService;
      this._userService = usersService;
      this._tokenManager = tokenManager;
      this._validator = validator;
   
      this.postAuthenticationsHandler = this.postAuthenticationsHandler.bind(this);
      this.putAuthenticationsHandler = this.putAuthenticationsHandler.bind(this);
      this.deleteAuthenticationsHandler = this.deleteAuthenticationsHandler.bind(this);
    }
   async postAuthenticationsHandler(request, h) {
            this._validator.validatePostAuthenticationPayload(request.payload);
            const {username, password} = request.payload

            const id = await this._userService.verifyUserCredentials(username, password);
            
            const access = this._tokenManager.generateAccessToken({id})
            const refresh = this._tokenManager.generateRefreshToken({id})

            await this._service.addRefreshToken(refresh)

            const response = h.response({
                status:"success",
                message:"Authentication berhasil ditambahkan",
                data:{
                    accessToken: access,
                    refreshToken: refresh,
                }
            })
            response.code(201);
            return response
      }
     
      async putAuthenticationsHandler(request, h) {
            this._validator.validatePutAuthenticationPayload(request.payload);
            const {refreshToken} = request.payload

            await this._service.verifyRefreshToken(refreshToken);
            const {id} = this._tokenManager.verifyRefreshToken(refreshToken);
            
            const access = this._tokenManager.generateAccessToken({id})

            const response = h.response({
                status:"success",
                message:"Authentication berhasil diperbarui",
                data:{
                    accessToken: access,
                }
            })
            response.code(200);
            return response
      }
     
      async deleteAuthenticationsHandler(request, h) {
          this._validator.validateDeleteAuthenticationPayload(request.payload)
          const {refreshToken} = request.payload

          await this._service.verifyRefreshToken(refreshToken);
          await this._service.deleteRefreshToken(refreshToken);

          return {
            status: 'success',
            message: 'Refresh token berhasil dihapus',
          };
      }
    
  }
  module.exports = AuthHandler;