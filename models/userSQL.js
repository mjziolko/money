const { Client } = require('pg');

class UserSQL {
    static async createUser(slackId, slackTeamId, slackUserName, name) {
        let userName = slackUserName;
        if (name) {
            userName = name;
        }

        try {
            const client = new Client();
            await client.connect();

            await client.query(
                `INSERT INTO users (slack_id, slack_team_id, name)\
                VALUES(\
                    '${slackId}',\
                    '${slackTeamId}',\
                    '${userName}'\
                );`
            );

            await client.end();
        }
        catch(error) {
            console.error(error);
        }
    }
}

module.exports = UserSQL;
