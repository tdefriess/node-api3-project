const express = require('express');

const postRouter = require('./posts/postRouter');
const userRouter = require('./users/userRouter');

const server = express();

server.use(express.json())
server.use(logger);

server.get('/', (req, res) => {
  res.send({
    message: 'welcome to the mini-blog',
    env: process.env.ENVMSG
  });
});

server.use('/api/user', userRouter);
server.use('/api/posts', postRouter);
//custom middleware

function logger(req, res, next) {
  console.log(`${req.method} to ${req.originalUrl} at ${new Date().toISOString()}`)

  next();
}



module.exports = server;
