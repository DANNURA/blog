const connect = require('./connect');
const express = require('express');
const cors = require('cors');
const posts = require('./postRoutes');

const app = express();
const PORT = 3000;

app.use(cors());
app.use(express.json());

// Use '/posts' as the base path for all routes in postRoutes.js
app.use('/posts', posts);

app.listen(PORT, () => {
    connect.connectToServer();
    console.log('Server is running on port', PORT);
});
