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

    static async getUserNameFromSlackId(slackId) {
        let name = "";
        try {
            const client = new Client();
            await client.connect();

            let response = await client.query(
                `SELECT name FROM users
                WHERE slack_id = '${slackId}'`
            );

            name = response.rows[0].name;
        }
        catch (error) {
            console.error(error);
        }

        return name;
    }
}

module.exports = UserSQL;
