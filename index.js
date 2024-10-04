const express = require('express');
const mongoose = require('mongoose');
const config = require('./config/config')
const app = express();
const cors = require('cors');

const port = 3001;
const routes = require('./routes');  // Import module route chính

app.use(cors()); 
// Middleware để parse JSON body
app.use(express.json());

// Middleware để parse URL-encoded data (form submissions)
app.use(express.urlencoded({ extended: true }));
app.get('/', (req, res) => {
  res.send('Hello World!');
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});

mongoose.connect(config.connectionString)
  .then(() => {
    console.log('MongoDB connected!');
    // Chỉ bắt đầu lắng nghe sau khi MongoDB kết nối thành công
    app.listen(config.port, () => {
      console.log(`Server is running on http://localhost:${config.port}`);
    });
  })
  .catch((error) => {
    console.error('MongoDB connection error:', error);
  });

app.use('/', routes); 