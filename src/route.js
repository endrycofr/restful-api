const {
    addClientsHandler,
    getAllClientsHandler,
    getClientsHandler,
    editClientsHandler,
    deleteClientsHandler

} = require('./handler')

const routes = [{
        method: 'POST',
        path: '/books',
        handler: addClientsHandler
    },
    {
        method: 'GET',
        path: '/books',
        handler: getAllClientsHandler
    },
    {
        method: 'GET',
        path: '/books/{clientId}',
        handler: getClientsHandler
    },
    {
        method: 'PUT',
        path: '/books/{clientId}',
        handler: editClientsHandler
    },
    {
        method: 'DELETE',
        path: '/books/{clientId}',
        handler: deleteClientsHandler
    },

];

module.exports = routes;