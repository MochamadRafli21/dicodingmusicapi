const routes = (handler) => [
    {
      method: 'POST',
      path: '/albums',
      handler: handler.postAlbumHandler,
    },
    {
      method: 'GET',
      path: '/albums',
      handler: handler.getAlbumsHandler,
    },
    {
      method: 'GET',
      path: '/albums/{id}',
      handler: handler.getAlbumByIdHandler,
    },
    {
      method: 'PUT',
      path: '/albums/{id}',
      handler: handler.putAlbumByIdHandler,
    },
    {
      method: 'DELETE',
      path: '/albums/{id}',
      handler: handler.deleteAlbumByIdHandler,
    },
    {
      method: 'POST',
      path: '/albums/{id}/likes',
      handler: handler.postAlbumLikesHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'GET',
      path: '/albums/{id}/likes',
      handler: handler.getAlbumLikesByIdHandler,
    },
  ];
   
  module.exports = routes;