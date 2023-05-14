const { nanoid } = require('nanoid');
const bookshelf = require('./book');

const addNewBook = (request, h) => {
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

  const id = nanoid(16);
  const finished = pageCount === readPage;
  const insertedAt = new Date().toISOString();
  const updatedAt = insertedAt;

  const newBook = {
    id,
    name,
    year,
    author,
    summary,
    publisher,
    pageCount,
    readPage,
    finished,
    reading,
    insertedAt,
    updatedAt,
  };

  if (!name) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. Mohon isi nama buku',
    });
    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
    });
    response.code(400);
    return response;
  }

  bookshelf.push(newBook);

  const isSuccess = bookshelf.filter((book) => book.id === id).length > 0;

  if (isSuccess) {
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil ditambahkan',
      data: {
        bookId: id,
      },
    });
    response.code(201);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal ditambahkan',
  });
  response.code(500);

  return response;
};

const getAllBooks = (request, h) => {
  const { reading, finished, name } = request.query;
  let bookList = bookshelf;

  if (reading === '0') { bookList = bookshelf.filter((item) => item.reading === false); }
  if (reading === '1') { bookList = bookshelf.filter((item) => item.reading === true); }
  if (finished === '0') { bookList = bookshelf.filter((item) => item.finished === false); }
  if (finished === '1') { bookList = bookshelf.filter((item) => item.finished === true); }
  if (name) {
    bookList = bookshelf.filter((item) => item.name.toLowerCase().includes(name.toLowerCase()));
  }

  const response = h.response({
    status: 'success',
    data: {
      books: bookList.map((item) => ({
        id: item.id,
        name: item.name,
        publisher: item.publisher,
      })),
    },
  });

  response.code(200);
  return response;
};

const getBookDetails = (request, h) => {
  const { id } = request.params;
  const specificBook = bookshelf.filter((book) => book.id === id)[0];
  if (specificBook !== undefined) {
    return {
      status: 'success',
      data: {
        book: { ...specificBook },
      },
    };
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku tidak ditemukan',
  });

  response.code(404);
  return response;
};

const updateBookDetails = (request, h) => {
  const { id } = request.params;
  const updatedAt = new Date().toISOString();
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
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. Mohon isi nama buku',
    });

    response.code(400);
    return response;
  }

  if (readPage > pageCount) {
    const response = h.response({
      status: 'fail',
      message: 'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
    });

    response.code(400);
    return response;
  }

  const indexBoox = bookshelf.findIndex((book) => book.id === id);

  if (indexBoox !== -1) {
    bookshelf[indexBoox] = {
      ...bookshelf[indexBoox],
      name,
      year,
      author,
      summary,
      publisher,
      pageCount,
      readPage,
      reading,
      updatedAt,
    };

    const response = h.response({
      status: 'success',
      message: 'Buku berhasil diperbarui',
    });

    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Gagal memperbarui buku. Id tidak ditemukan',
  });

  response.code(404);
  return response;
};

const deleteBookById = (request, h) => {
  const { id } = request.params;
  const indexBoox = bookshelf.findIndex((book) => book.id === id);

  if (indexBoox !== -1) {
    bookshelf.splice(indexBoox, 1);
    const response = h.response({
      status: 'success',
      message: 'Buku berhasil dihapus',
    });
    response.code(200);
    return response;
  }

  const response = h.response({
    status: 'fail',
    message: 'Buku gagal dihapus. Id tidak ditemukan',
  });
  response.code(404);
  return response;
};

module.exports = {
  addNewBook,
  getAllBooks,
  getBookDetails,
  updateBookDetails,
  deleteBookById,
};
