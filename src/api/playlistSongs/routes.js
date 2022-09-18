const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists/{id}/songs',
      handler: handler.postPlaylistSongsHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'GET',
      path: '/playlists/{id}/songs',
      handler: handler.getPlaylistSongsHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}/songs',
      handler: handler.deletePlaylistSongsHandler,
      options: {
        auth: "jwt"
      }
    },
  ];
   
  module.exports = routes;