const SlackRequest = require('../models/slackRequest');
const CommandHandler = require('../models/commandHandler');

var express = require('express');
var router = express.Router();

router.get('/', function(req, res, next) {
    res.send("money!");
});

router.post('/api', async function(req, res, next) {
    let slackParams = req.query;
    let url = req.url;
    let slackRequest = new SlackRequest(url, slackParams);
    let commandHandler = new CommandHandler(slackRequest);
    let validCommand = commandHandler.validateCommand();

    // TODO: Also validate message came from Slack
    if (!validCommand) {
        res.status(500).send(`Command ${commandHandler.command} is not supported.`);
        return;
    }

    res.send('ok');

    await commandHandler.executeCommand();

    //const response = await Users.createUser('asdf', 'brad');
})

module.exports = router;
