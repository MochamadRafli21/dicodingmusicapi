const SongsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'songs',
  version: '1.0.0',
  register: async (server, { SongsService, validator }) => {
    const songsHandler = new SongsHandler(SongsService, validator);
    server.route(routes(songsHandler));
  },
};