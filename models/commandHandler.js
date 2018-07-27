const UserSQL = require('../models/userSQL');

class CommandHandler {
    constructor(slackRequest) {
        this.supportedCommands = ['init'];
        this.slackRequest = slackRequest;

        let rawCommand = slackRequest.text;
        this.command = rawCommand.split(' ')[0];
        this.commandParams = rawCommand.substr(this.command.length + 1);
    }

    validateCommand() {
        let valid = false;
        if (this.supportedCommands.includes(this.command)) {
            valid = true;
        }

        return valid;
    }

    async executeCommand() {
        switch (this.command) {
            case 'init':
                await UserSQL.createUser(this.slackRequest.userId, this.slackRequest.teamId, this.slackRequest.userName, this.commandParams)
        }
    }
}

module.exports = CommandHandler;
