const express = require('express');
const validatePost = require('../middleware/validatePost')

const Posts = require('./postDb.js');

const router = express.Router();

router.get('/', (req, res) => {
  Posts.get()
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was a problem retrieving posts"
      })
    })
});

router.get('/:id', validatePostId, (req, res) => {
  res.status(200).json(req.post);
});

router.delete('/:id', validatePostId, (req, res) => {
  Posts.remove(req.post.id)
    .then(records => {
      res.status(200).json({
        message: `${records} post deleted`
      })
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "Could not delete post"
      })
    })
});

router.put('/:id', validatePostId, validatePost, (req, res) => {
  Posts.update(req.post.id, req.body)
    .then(count => {
      Posts.getById(req.post.id)
        .then(post => {
          res.status(200).json(post)
        })
        .catch(err => {
          console.log(err);
          res.status(500).json({
            message: "Updated post could not be found",
            error: err
          })
        })      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "could not update post"
      })

    })
});

// custom middleware

function validatePostId(req, res, next) {
  const { id } = req.params;
  console.log(`\nValidating post ID...`);
  Posts.getById(id)
    .then(post => {
      if (post) {
        req.post = post;        
        next();
      } else {
        res.status(400).json({
          message: "post not found"
        })
      }
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was a problem fetching post data"
      })
    })
}

module.exports = router;
