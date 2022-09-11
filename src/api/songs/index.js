const SongsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { SongsService, songValidator }) => {
    const songsHandler = new SongsHandler(SongsService, songValidator);
    server.route(routes(songsHandler));
  },
};