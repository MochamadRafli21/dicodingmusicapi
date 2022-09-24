const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt');
const path = require('path');
const Inert = require('@hapi/inert');

// ALBUMS
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')
// SONGS
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')
// USERS
const users = require('./api/users');
const UserService = require('./services/postgres/UserService')
const UserValidator = require('./validator/users')
const ClientError = require('./api/exceptions/ClientError');
// AUTHENTICATION
const authentications = require('./api/authentications');
const AuthenticationsService = require('./services/postgres/AuthenticationService');
const TokenManager = require('./tokenize/TokenManager');
const AuthenticationsValidator = require('./validator/authentications');
// PLAYLIST
const PlaylistService = require('./services/postgres/PlaylistService');
const playlist = require('./api/playlist');
const PlaylistValidator = require('./validator/playlist');
// PLAYLIST SONGS
const playlistSongs = require('./api/playlistSongs');
const PlaylistSongsService = require('./services/postgres/PlaylistSongsService');
const PlaylistSongsValidator = require('./validator/playlistsongs');
// COLLABORATIONS
const collaborations = require('./api/collaborations');
const CollaborationsService = require('./services/postgres/CollaborationsService');
const CollaborationsValidator = require('./validator/collaborations')
// PLAYLIST LOG
const playlistLog = require('./api/playlistLog');
const PlaylistLogService = require('./services/postgres/PlaylistLogService');
// EXPORT
const _exports = require("./api/exports");
const ExportService = require("./services/rabbitmq/ExportService");
const ExportsSongPlaylistValidator = require('./validator/exports')
// UPLOADS
const uploads = require('./api/uploads');
const UploadsService = require('./services/storage/StorageService');
const UploadValidator = require('./validator/uploads');

require('dotenv').config();

const init = async () => {
    const userService = new UserService();
    const authService = new AuthenticationsService();
    const albumsService = new AlbumsService();
    const collaborationsService = new CollaborationsService();
    const songsService = new SongsService();
    const playlistLogService = new PlaylistLogService();
    const playlistService = new PlaylistService(collaborationsService);
    const playlistSongsService = new PlaylistSongsService(playlistLogService);
    const uploadsService = new UploadsService(path.resolve(__dirname, 'api/uploads/file/images'));

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
    });

    await server.register([
        {
          plugin: Jwt,
        },
        {
          plugin: Inert,
        },
      ]);

    server.auth.strategy('jwt', 'jwt', {
        keys: process.env.ACCESS_TOKEN_KEY,
        verify: {
          aud: false,
          iss: false,
          sub: false,
          maxAgeSec: process.env.ACCESS_TOKEN_AGE,
        },
        validate: (artifacts) => ({
          isValid: true,
          credentials: {
            id: artifacts.decoded.payload.id,
          },
        }),
      });

    await server.register([{
        plugin: albums,
        options: {
            AlbumsService: albumsService,
            albumValidator: AlbumsValidator,
            },
        },
        {
        plugin: songs,
        options: {
            SongsService: songsService,
            songValidator: SongsValidator,
            },
        },
        {
            plugin: users,
            options:{
                UserService: userService,
                userValidator: UserValidator,
            }
        },
        {
            plugin: authentications,
            options: {
                authenticationsService: authService,
                usersService: userService,
                tokenManager: TokenManager,
                validator: AuthenticationsValidator,
            }
        },
        {
            plugin: playlist,
            options:{
                PlaylistService: playlistService,
                validator: PlaylistValidator
            }
        },
        {
            plugin: playlistSongs,
            options:{
                PlaylistSongsService: playlistSongsService,
                PlaylistService: playlistService,
                SongsService: songsService,
                validator: PlaylistSongsValidator
            }
        },
        {
            plugin: collaborations,
            options:{
                CollaborationsService: collaborationsService,
                PlaylistService: playlistService,
                validator: CollaborationsValidator
                
            }
        },
        {
            plugin: playlistLog,
            options:{
                playlistLogService: playlistLogService,
                playlistService: playlistService,
            }
        },
        {
            plugin: _exports,
            options:{
                service: ExportService,
                playlistService: playlistService,
                validator: ExportsSongPlaylistValidator,
            }
        },
        {
            plugin: uploads,
            options:{
                uploadsService: uploadsService,
                uploadsValidator: UploadValidator,
                albumService: albumsService,
            }
        }
    ]);
    
    server.ext('onPreResponse', (request, h) => {
        // mendapatkan konteks response dari request
        const { response } = request;
        if (response instanceof Error) {
     
          // penanganan client error secara internal.
          if (response instanceof ClientError) {
            const newResponse = h.response({
              status: 'fail',
              message: response.message,
            });
            newResponse.code(response.statusCode);
            return newResponse;
          }
          // mempertahankan penanganan client error oleh hapi secara native, seperti 404, etc.
          if (!response.isServer) {
            return h.continue;
          }
          // penanganan server error sesuai kebutuhan
          const newResponse = h.response({
            status: 'error',
            message: 'terjadi kegagalan pada server kami',
          });
          newResponse.code(500);
          return newResponse;
        }
    
    
    // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    return response.continue || response;
    });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

