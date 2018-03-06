const mongoose = require('mongoose');

module.exports = function() {
  mongoose.connect('mongodb://localhost/testdb')
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Could not connect to MongoDB', err));
}