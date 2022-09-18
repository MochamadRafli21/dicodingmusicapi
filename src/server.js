const Hapi = require('@hapi/hapi');
const Jwt = require('@hapi/jwt')
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

require('dotenv').config();

const init = async () => {
    const userService = new UserService();
    const authService = new AuthenticationsService();
    const albumsService = new AlbumsService();
    const collaborationsService = new CollaborationsService();
    const songsService = new SongsService();
    const playlistService = new PlaylistService(collaborationsService);
    const playlistSongsService = new PlaylistSongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
    });

    await server.register(Jwt);

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
        }
    ]);
    
    server.ext('onPreResponse', (request, h) => {
    // mendapatkan konteks response dari request
    const { response } = request;
    
    if (response.source instanceof ClientError) {
        // membuat response baru dari response toolkit sesuai kebutuhan error handling
        const newResponse = h.response({
        status: 'fail',
        message: response.source.message,
        });
        newResponse.code(response.statusCode);
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

