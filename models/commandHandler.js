const UserSQL = require('../models/userSQL');
const TransactionSQL = require('../models/transactionSQL');

class CommandHandler {
    constructor(slackRequest) {
        this.supportedCommands = ['init', 'give'];
        this.slackRequest = slackRequest;

        let rawCommand = slackRequest.text;
        this.command = rawCommand.split(' ')[0];
        this.commandParams = rawCommand.substr(this.command.length + 1).split(' ');
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
                await UserSQL.createUser(this.slackRequest.userId, this.slackRequest.teamId, this.slackRequest.userName, this.commandParams[0]);
                break;
            case 'give':
                await TransactionSQL.createTransaction(this.slackRequest.userId, this.commandParams[0], this.commandParams[1], this.commandParams[2]);
                break;
        }
    }
}

module.exports = CommandHandler;
