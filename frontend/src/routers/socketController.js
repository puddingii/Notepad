export default class SocketController {
    constructor(io, socket) {
        this.#io = io;
        this.#socket = socket;
    }
    #io;
    #socket;
    #currentRoom;

    /**
     * 소켓이벤트로 들어온 것들에 대한 함수셋팅.
     */
    init() {
        this.#socket.on("clientMessage", (user, text) => this.sendBroadcastMessage(user, text));
        this.#socket.on("joinNewRoom", (userId) => this.joinNewRoom(userId));
        this.#socket.on("joinRoom", (data) => this.join(data.userId, data.roomName));
        this.#socket.on("exitRoom", () => this.exit());
        this.#socket.on("disconnect", () => this.disconnectRoom());
        this.#socket.on("clientSendFile", (data) => this.sendBroadcastFile(data));
    }

    sendBroadcastFile(data) {
        this.#socket.broadcast.to(this.#currentRoom).emit("serverSendFile", data);
    }

    /**
     * exit를 눌렀을 때 해당방에서 나가기
     */
    exit() {
        this.#socket.leave(this.#currentRoom);
    }

    /**
     * 연결이 끊겼을때 함수
     */
    disconnectRoom() {
        console.log(`disconnect`);
    }

    /**
     * 방에 참여했을 때 기존에 있던 방은 나가고 해당 방의 사람들에게 참여소식을 알림
     * 
     * @param {string} userId 방금 방에 참여한 유저아이디
     * @param {string} roomName 참여한 방 이름
     */
    join(userId, roomName) {
        if (this.#currentRoom) this.exit();
        this.#currentRoom = roomName;
        this.#socket.join(roomName);
        this.sendBroadcastMessage("SYSTEM", userId);
    }

    /**
     * new버튼을 눌렀을 때 랜덤string값을 생성하고 생성한 랜덤값을 이름으로 하는 방에 들어간다
     * 
     * @param {string} userId 유저아이디
     */
    joinNewRoom(userId) {
        let randomString = Math.random().toString(36).substr(2, 11);
        while (this.#io.sockets.adapter.rooms.get(randomString)) {
            randomString = Math.random().toString(36).substr(2, 11);
        }
        this.join(userId, randomString);
        this.#socket.emit("roomName", randomString);
    }

    /**
     * send한 client 외의 룸안에 있는 전체 사람에게 메시지를 전달
     * 
     * @param {string} user 유저 아이디 
     * @param {string} text 넘길 메시지
     */
    sendBroadcastMessage(user, text) {
        this.#socket.broadcast.to(this.#currentRoom).emit("serverSendMessage", { user, text });
    }
}
