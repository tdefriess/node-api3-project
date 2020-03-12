const express = require('express');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(logger);

server.get('/', (req, res) => {
  res.send(`<h2>Let's write some middleware!</h2>`);
});

server.use('/api/user', userRouter);
server.use('/api/posts', postRouter);
//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${new Date().toISOString()}`)

  next();
}



module.exports = server;
