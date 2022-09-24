const ExportHandler = require('./handler')
const routes = require('./routes')

module.exports = {
    name: 'exports',
    versions: '1.0.0',
    register: async (server, {service, playlistService, validator}) => {
        const exportHandler = new ExportHandler(service, playlistService, validator);
        server.route(routes(exportHandler));
    }
}