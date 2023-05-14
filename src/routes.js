const {
  addNewBook,
  getAllBooks,
  getBookDetails,
  updateBookDetails,
  deleteBookById,
} = require('./handler');

const routes = [
  {
    method: 'POST',
    path: '/books',
    handler: addNewBook,
  },
  {
    method: 'GET',
    path: '/books',
    handler: getAllBooks,
  },
  {
    method: 'GET',
    path: '/books/{id}',
    handler: getBookDetails,
  },
  {
    method: 'PUT',
    path: '/books/{id}',
    handler: updateBookDetails,
  },
  {
    method: 'DELETE',
    path: '/books/{id}',
    handler: deleteBookById,
  },
];

module.exports = routes;
