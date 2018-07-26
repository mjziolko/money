var Users = require('../models/users')

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("money!");
});

router.post('/api', async function(req, res, next) {
    const response = await Users.createUser('asdf', 'brad');
    res.send(response);
})

module.exports = router;
