const Hapi = require('@hapi/hapi');
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
const { options } = require('joi');
require('dotenv').config();

const init = async () => {
    const userService = new UserService();
    const albumsService = new AlbumsService();
    const songsService = new SongsService();

    const server = Hapi.server({
        port: process.env.PORT,
        host: process.env.HOST,
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
                userValidator: userValidator,
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

