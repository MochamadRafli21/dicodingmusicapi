const PlaylistLogHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'playlistLog',
  version: '1.0.0',
  register: async (server, { playlistLogService, playlistService }) => {
    const playlistLogHandler = new PlaylistLogHandler(playlistLogService, playlistService);
    server.route(routes(playlistLogHandler));
  },
};