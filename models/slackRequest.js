class SlackRequest {
    constructor(url, req) {
        this.rawMessage = url;
        this.teamId = req.team_id;
        this.enterpriseId = req.enterprise_id;
        this.channelId = req.channel_id;
        this.userId = req.user_id;
        this.userName = req.user_name;
        this.text = req.text;
        this.responseUrl = req.response_url;
    }
}

module.exports = SlackRequest;
