class ChatHub {
    constructor(serverUrl) {
        this._serverUrl = serverUrl;
        var recvFunc = this._receiveMessage.bind(this);
        this._timer = setInterval(recvFunc, 10000);
    }

    onMessageReceive(handler) {
        this._handler = handler;
    }

    _receiveMessage() {
        if (this._handler) {
            this._handler({
                user: 'testUser',
                text: "Hello I am a bot"
            });
        }
    }
}