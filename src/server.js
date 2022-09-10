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

    await server.register({
        plugin: albums,
        options: {
            AlbumsService: albumsService,
            validator: AlbumsValidator,
            },
        },
      );
    await server.register( {
        plugin: songs,
        options: {
            SongsService: songsService,
            validator: SongsValidator,
            },
        })

    await server.start();
    console.log('Server running on %s', server.info.uri);
};

process.on('unhandledRejection', (err) => {

    console.log(err);
    process.exit(1);
});

init();

