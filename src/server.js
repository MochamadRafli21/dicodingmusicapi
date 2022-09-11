const Hapi = require('@hapi/hapi');
const albums = require('./api/albums');
const AlbumsService = require('./services/postgres/AlbumsService')
const AlbumsValidator = require('./validator/albums')
const songs = require('./api/songs');
const SongsService = require('./services/postgres/SongsService')
const SongsValidator = require('./validator/songs')
require('dotenv').config();

const init = async () => {
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
        }
    ]);
    
    // server.ext('onPreResponse', (request, h) => {
    // // mendapatkan konteks response dari request
    // const { response } = request;
    
    
    // if (response instanceof ClientError) {
    //     // membuat response baru dari response toolkit sesuai kebutuhan error handling
    //     const newResponse = h.response({
    //     status: 'fail',
    //     message: response.message,
    //     });
    //     newResponse.code(response.statusCode);
    //     return newResponse;
    // }
    
    
    // // jika bukan ClientError, lanjutkan dengan response sebelumnya (tanpa terintervensi)
    // return response.continue || response;
    // });

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

