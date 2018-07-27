const { Client } = require('pg');
const UserSQL = require('../models/userSQL');

class TransactionSQL {
    static async createTransaction(sender, receiver, amount, description) {
        let dateObject = new Date();
        let date = dateObject.toISOString();
        let time = dateObject.toLocaleTimeString();
        try {
            const client = new Client();
            await client.connect();

            let senderId = this.normalizeSlackId(sender);
            let receiverId = this.normalizeSlackId(receiver);

            if (senderId === receiverId) {
                throw new Error('User cannot give themselves money.');
            }

            if (!description) {
                description = '';
            }

            await client.query(
                `INSERT INTO transactions (sender, receiver, amount, date, time, description)\
                VALUES(\
                    '${senderId}',\
                    '${receiverId}',\
                    '${amount}',\
                    '${date}',\
                    '${time}',\
                    '${description}'\
                );`
            );

            await client.end();
        }
        catch (error) {
            console.error(error);
        }
    }

    static async getDebtStatus(slackUserId) {
        let debtObject = null;
        try {
            const client = new Client();
            await client.connect();

            let userId = this.normalizeSlackId(slackUserId);

            let sendResponse = await client.query(
                `SELECT receiver, amount FROM transactions
                WHERE sender = '${userId}';`
            );

            let receiveResponse = await client.query(
                `SELECT sender, amount FROM transactions
                WHERE receiver = '${userId}';`
            );
            
            await client.end();

            debtObject = this.createDebtObject(sendResponse.rows, receiveResponse.rows);
        }
        catch (error) {
            console.error(error);
        }

        return debtObject;
    }

    static async createDebtObject(sendRows, receiveRows) {
        let debt = {};

        for (const row of sendRows) {
            let user = await UserSQL.getUserNameFromSlackId(row.receiver);
            let amount = Number(row.amount.replace('$', ''));

            if (user in debt) {
                let value = debt[user];
                debt[user] = value - amount;
            }
            else {
                debt[user] = -amount;
            }
        }

        for (const row of receiveRows) {
            let user = await UserSQL.getUserNameFromSlackId(row.sender);
            let amount = Number(row.amount.replace('$', ''));

            if (user in debt) {
                let value = debt[user];
                debt[user] = value + amount;
            }
            else {
                debt[user] = amount;
            }
        }

        return debt;
    }

    static normalizeSlackId(slackId) {
        let strippedSlackId = slackId;
        if (slackId.includes('<@')) {
            strippedSlackId = slackId.substr(2, slackId.length - 3);
        }

        return strippedSlackId;
    }
}

module.exports = TransactionSQL;
