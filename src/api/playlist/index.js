const PlaylistHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'playlist',
  version: '1.0.0',
  register: async (server, { PlaylistService, validator }) => {
    const playlistHandler = new PlaylistHandler(PlaylistService, validator);
    server.route(routes(playlistHandler));
  },
};