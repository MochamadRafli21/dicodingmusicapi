const UploadsHandler = require('./handler');
const routes = require('./routes');
 
module.exports = {
  name: 'uploads',
  version: '1.0.0',
  register: async (server, { uploadsService, albumService, uploadsValidator}) => {
    const uploadsHandler = new UploadsHandler(uploadsService, albumService, uploadsValidator);
    server.route(routes(uploadsHandler));
  },
};