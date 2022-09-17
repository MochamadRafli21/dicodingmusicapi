const AuthHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'authentications',
  version: '1.0.0',
  register: async (server, { authenticationsService ,usersService, tokenManager, validator }) => {
    const authHandler = new AuthHandler(authenticationsService, usersService, tokenManager, validator);
    server.route(routes(authHandler));
  },
};