const { Client } = require('pg');

class TransactionSQL {
    static async createTransaction(sender, receiver, amount, description) {
        let dateObject = new Date();
        let date = dateObject.toISOString();
        let time = dateObject.toLocaleTimeString();
        try {
            const client = new Client();
            await client.connect();

            let senderId = await this.getUserIdFromSlackId(client, sender);
            let receiverId = await this.getUserIdFromSlackId(client, receiver);

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

    static async getUserIdFromSlackId(client, slackId) {
        if (slackId.includes('<@')) {
            slackId = slackId.substr(2, slackId.length - 3);
        }

        let result = null;

        try {
            result = await client.query(
                `SELECT id FROM users\
                WHERE slack_id = '${slackId}';`
            );
        }
        catch (error) {
            console.error(error);
            throw new Error(error.message);
        }

        if (result.rowCount === 0) {
            throw new Error(`User ${slackId} does not exist`);
        }

        let id = result.rows[0].id;

        return id;
    }
}

module.exports = TransactionSQL;
