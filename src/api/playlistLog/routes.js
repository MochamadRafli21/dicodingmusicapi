const routes = (handler) => [
    {
      method: 'GET',
      path: '/playlists/{id}/activities',
      handler: handler.getPlaylistLogHandler,
      options: {
        auth: "jwt"
      }
    }
  ];
   
  module.exports = routes;