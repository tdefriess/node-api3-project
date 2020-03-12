const express = require('express');

const Users = require('./userDb.js');

const router = express.Router();

router.use(express.json())


router.post('/', (req, res) => {
  // do your magic!
});

router.post('/:id/posts', (req, res) => {
  // do your magic!
});

router.get('/', (req, res) => {
  // do your magic!
  // res.send('<h1>filler</h1>')
});

router.get('/:id', validateUserId, (req, res) => {
  // do your magic!
  // res.status(200).json({message: 'hello'})
});

router.get('/:id/posts', (req, res) => {
  // do your magic!
});

router.delete('/:id', (req, res) => {
  // do your magic!
});

router.put('/:id', (req, res) => {
  // do your magic!
});

//custom middleware

function validateUserId(req, res, next) {
  const id = req.params.id;
  console.log(`\nValidate user ID...\n`)
  console.log('User ID:', id)

  Users.getById(id)
    .then(user => {
      if (user) {
        req.user = user;
        console.log(req.user)
        next()
      } else {
        res.status(400).json({
          message: 'user name not found'
        })        
      }
    })
    .catch(err => {
      console.log(err)
    })

  next();
}

function validateUser(req, res, next) {
  if (!req.body){
    res.status(400).json({
      message: "Missing user data"
    })
  } else if (!req.body.name){
    res.status(400).json({
      message: "Missing required name field"
    })
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
  }
}

module.exports = router;
