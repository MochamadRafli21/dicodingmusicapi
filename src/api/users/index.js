const UserHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'users',
  version: '1.0.0',
  register: async (server, { UserService, userValidator }) => {
    const userHandler = new UserHandler(UserService, userValidator);
    server.route(routes(userHandler));
  },
};