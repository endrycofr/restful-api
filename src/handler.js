const nanoid = require('nanoid');
const clients = require('./client');

const generateUniqueId = () => {
    return nanoid.nanoid(); // Use nanoid to generate unique IDs
};

const validateClientExists = (clientId) => {
    return clients.find((client) => client.id === clientId);
};

const addClientsHandler = (request, h) => {
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const insertedAt = new Date().toISOString();
    const finished = pageCount === readPage;
    const id = generateUniqueId();

    const newClient = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        insertedAt,
        updatedAt: insertedAt,
        finished,
    };

    clients.push(newClient);

    return h.response({
        status: 'success',
        message: 'Buku berhasil ditambahkan',
        data: newClient,
    }).code(201);
};

const getAllClientsHandler = (request, h) => {
    const {
        reading,
        finished,
        bookName
    } = request.query;

    let filteredClients = [...clients];

    if (reading !== undefined) {
        filteredClients = filteredClients.filter(client => client.reading === (reading === '1'));
    }

    if (finished !== undefined) {
        filteredClients = filteredClients.filter(client => client.finished === (finished === '1'));
    }

    if (bookName !== undefined) {
        const groupedBooks = filteredClients.reduce((result, client) => {
            const {
                name
            } = client;
            if (!result[name]) {
                result[name] = [];
            }
            result[name].push({
                id: client.id,
                name: client.name,
                publisher: client.publisher,
            });
            return result;
        }, {});

        return h.response({
            status: 'success',
            data: {
                books: groupedBooks[bookName] || [],
            },
        }).code(200);
    } else {
        const books = filteredClients.map(client => ({
            id: client.id,
            name: client.name,
            publisher: client.publisher,
        }));

        return h.response({
            status: 'success',
            data: {
                books,
            },
        }).code(200);
    }
};

const getClientsHandler = (request, h) => {
    const {
        clientId
    } = request.params;
    const client = validateClientExists(clientId);

    if (client) {
        return h.response({
            status: 'success',
            data: client,
        }).code(200);
    } else {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }
};

const editClientsHandler = (request, h) => {
    const {
        clientId
    } = request.params;
    const {
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
    } = request.payload;

    const client = validateClientExists(clientId);

    if (!client) {
        return h.response({
            status: 'fail',
            message: 'Buku tidak ditemukan',
        }).code(404);
    }

    if (!name) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. Mohon isi nama buku',
        }).code(400);
    }

    if (readPage > pageCount) {
        return h.response({
            status: 'fail',
            message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        }).code(400);
    }

    const updatedAt = new Date().toISOString();
    const finished = pageCount === readPage;

    const index = clients.findIndex((c) => c.id === clientId);

    clients[index] = {
        ...clients[index],
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        reading,
        updatedAt,
        finished,
    };

    return h.response({
        status: 'success',
        message: 'Buku berhasil diperbarui',
    }).code(200);
};

const deleteClientsHandler = (request, h) => {
    const {
        clientId
    } = request.params;

    const index = clients.findIndex((client) => client.id === clientId);

    if (index !== -1) {
        clients.splice(index, 1);
        return {
            status: 'success',
            message: 'Buku berhasil dihapus',
        };
    }

    return h.response({
        status: 'fail',
        message: 'Buku gagal dihapus. Id tidak ditemukan',
    }).code(404);
};

module.exports = {
    addClientsHandler,
    getAllClientsHandler,
    getClientsHandler,
    editClientsHandler,
    deleteClientsHandler
};