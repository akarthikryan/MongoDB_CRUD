const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const exhbs = require('express-handlebars');
const { getDatabase } = require('./db');
const BookModel = require('./models/bookModel');
const mongoose = require('mongoose'); // For ObjectId

// View Engine Setup
app.engine('hbs', exhbs.engine({
  layoutsDir: 'views/',
  defaultLayout: 'main',
  extname: 'hbs',
  runtimeOptions: {
    allowProtoPropertiesByDefault: true,
    allowedProtoMethods: true
  }
}));
app.set('view engine', 'hbs');
app.set('views', './views');

// Middleware
app.use(bodyparser.urlencoded({ extended: true }));

// Connect to DB before routes
getDatabase().then(() => {
  // Routes
  app.get('/', async (req, res) => {
    let message = '';
    let edit_id, edit_book;

    // Get all books
    let books = await BookModel.find({});

    // Edit book logic
    if (req.query.edit_id) {
      edit_id = req.query.edit_id;
      edit_book = await BookModel.findById(edit_id);
    }

    // Delete book
    if (req.query.delete_id) {
      await BookModel.findByIdAndDelete(req.query.delete_id);
      return res.redirect('/?status=3');
    }

    // Status message
    switch (req.query.status) {
      case '1': message = 'Book added successfully'; break;
      case '2': message = 'Book updated successfully'; break;
      case '3': message = 'Book deleted successfully'; break;
      default: message = '';
    }

    res.render('main', { message, books, edit_id, edit_book });
  });

  // Store new book
  app.post('/store_book', async (req, res) => {
    const book = new BookModel({
      title: req.body.title,
      author: req.body.author
    });
    await book.save();
    return res.redirect('/?status=1');
  });

  // Update book
  app.post('/update_book/:edit_id', async (req, res) => {
    const edit_id = req.params.edit_id;
    await BookModel.findByIdAndUpdate(edit_id, {
      title: req.body.title,
      author: req.body.author
    });
    return res.redirect('/?status=2');
  });

  // Start server
  app.listen(8000, () => {
    console.log('✅ Server is running on port 8000');
  });
});
