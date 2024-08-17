const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

let gfs;

// Create a connection to MongoDB using mongoose
const conn = mongoose.connection;

// Initialize GridFS stream
conn.once('open', () => {
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('BookUploads');
  console.log("GridFS Initailized")
});

const getGfs = () => {
    if (!gfs) {
      throw new Error('GridFS is not initialized');
    }
    return gfs;
  };

module.exports = { conn, getGfs };
