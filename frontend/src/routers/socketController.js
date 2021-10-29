export default class SocketController {
    constructor(io, socket) {
        this.#io = io;
        this.#socket = socket;
    }
    #io;
    #socket;

    joinRoom(roomName) {
        this.#socket.join(roomName);
        this.#socket.to(roomName).emit("enterRoom");
    }

    clientChat() {
        this.#socket.on("clientWrite", (user, text) => {
            this.#socket.broadcast.emit("serverWrite", { user, text });
        });
    }
}
