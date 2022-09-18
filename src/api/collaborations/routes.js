const routes = (handler) => [
    {
      method: 'POST',
      path: '/collaborations',
      handler: handler.postCollaborationsHandler,
      options: {
        auth: "jwt"
      }
    },
    {
      method: 'DELETE',
      path: '/collaborations',
      handler: handler.deleteCollaborationsHandler,
      options: {
        auth: "jwt"
      }
    },
  ];
   
  module.exports = routes;