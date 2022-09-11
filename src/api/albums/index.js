const AlbumsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'albums',
  version: '1.0.0',
  register: async (server, { AlbumsService, albumValidator }) => {
    const albumsHandler = new AlbumsHandler(AlbumsService, albumValidator);
    server.route(routes(albumsHandler));
  },
};