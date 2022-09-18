const PlaylisSongstHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'playlistSongs',
  version: '1.0.0',
  register: async (server, { PlaylistSongsService, PlaylistService, SongsService, validator }) => {
    const playlistSongsHandler = new PlaylisSongstHandler(PlaylistSongsService, PlaylistService, SongsService, validator);
    server.route(routes(playlistSongsHandler));
  },
};