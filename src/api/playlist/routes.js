const routes = (handler) => [
    {
      method: 'POST',
      path: '/playlists',
      handler: handler.postPlaylistHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'GET',
      path: '/playlists',
      handler: handler.getPlaylistHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'DELETE',
      path: '/playlists/{id}',
      handler: handler.deletePlaylistHandler,
      options: {
        auth: "jwt"
      }
    },
  ];
   
  module.exports = routes;