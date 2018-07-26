const { Client } = require('pg');

class Users {
    static async createUser(slackId, name) {
        var res = 'success';
        try {
            const client = new Client();
            await client.connect();

            const res = await client.query(
                `INSERT INTO users (slack_id, name)\
                VALUES(\
                    '${slackId}',\
                    '${name}\
                );`);

            await client.end();
        }
        catch(error) {
            console.error(error);
            res = 'error';
        }

        return res;
    }
}

module.exports = Users;
