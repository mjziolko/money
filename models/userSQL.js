const { Client } = require('pg');

class UserSQL {
    static async createUser(slackId, slackTeamId, slackUserName, name) {
        let userName = slackUserName;
        if (name) {
            userName = name;
        }

        let res = 'success';
        try {
            const client = new Client();
            await client.connect();

            const res = await client.query(
                `INSERT INTO users (slack_id, slack_team_id, name)\
                VALUES(\
                    '${slackId}',\
                    '${slackTeamId}',\
                    '${userName}'\
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

module.exports = UserSQL;
