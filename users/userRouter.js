const express = require('express');

const Users = require('./userDb.js');
const Posts = require('../posts/postDb.js')

const router = express.Router();

router.post('/', validateUser, (req, res) => {
  Users.insert(req.body)
    .then(data => {
      console.log(data)
      res.status(200).json(data);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "There was a problem saving user data"
      })
    })
});

router.post('/:id/posts', validateUserId, validatePost, (req, res) => {
  const post = {
    user_id: req.user.id,
    text: req.body.text
  }
  console.log(post);
  Posts.insert(post)
    .then(post => {
      res.status(200).json(post);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: 'Could not add post to database'
      })
    })
});

router.get('/', (req, res) => {
  Users.get()
    .then(resources => {
      res.status(200).json(resources);
    })
    .catch(err => {
      console.log("Error:", err);
      res.status(500).json({
        error: "There was an error retrieving the data"
      })
    })
});

router.get('/:id', validateUserId, (req, res) => {
  res.status(200).json(req.user);  
});

router.get('/:id/posts', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.getUserPosts(id)
    .then(posts => {
      res.status(200).json(posts);
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: "Could not retrieve posts by that user"
      })
    })
});

router.delete('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  Users.remove(id)
    .then(records => {
      res.status(200).json({
        message: `${records} user deleted`
      });
    })
    .catch(err => {
      res.status(500).json({
        message: 'Could not delete user'
      })
    })
});

router.put('/:id', validateUserId, (req, res) => {
  const { id } = req.params;
  const name = {name: req.body.name};
  Users.update(id, name)
    .then(count => {
      res.status(200).json({
        message: `${count} updated`
      })
    })
    .catch(err => {
      res.status(500).json({
        error: 'Could not update user'
      })
    })
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  console.log(`\nValidating user ID...\n`)  
  
  Users.getById(id)
    .then(user => {
      if (user) {
        console.log('user exists')
        req.user = user;
        console.log('req.user', req.user)        
        next();
      } else {
        res.status(400).json({
          message: 'user not found'
        })        
      }
    })
    .catch(err => {
      console.log('error', err)
      res.status(500).json({
        error: "There was a problem fetching user data"
      })
    })
}

function validateUser(req, res, next) {
  console.log(`\nValidating user...\n`)
  if (!req.body){
    res.status(400).json({
      message: "Missing user data"
    })
  } else if (!req.body.name){
    res.status(400).json({
      message: "Missing required name field"
    })
  } else {
    next();
  }
}

function validatePost(req, res, next) {
  if (!req.body){
    res.status(400).json({
      message: "Missing post data"
    })
  } else if (!req.body.text){
    res.status(400).json({
      message: "Missing required text field"
    })
  } else {
    next();
  }
}

module.exports = router;
