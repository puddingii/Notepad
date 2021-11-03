export default class SocketController {
    constructor(io, socket) {
        this.#io = io;
        this.#socket = socket;
    }
    #io;
    #socket;
    #currentRoom;
    #userId;
    #roomInfo;

    /**
     * 소켓이벤트로 들어온 것들에 대한 함수셋팅.
     *
     * @param {object} roomInfo RoomName을 키값으로 하고 userId들을 담은 array를 value값으로 하는 Object
     */
    init(roomInfo) {
        this.#roomInfo = roomInfo;
        this.#socket.on("clientMessage", (user, text) => this.sendBroadcastMessage(user, text));
        this.#socket.on("clientSendFile", (data) => this.sendBroadcastFile(data));
        this.#socket.on("joinNewRoom", (userId) => this.joinNewRoom(userId));
        this.#socket.on("joinRoom", (data) => this.join(data.userId, data.roomName));
        this.#socket.on("exitRoom", () => this.exit());
        this.#socket.on("disconnect", () => this.exit());
    }

    /**
     * broadcast emit을 관리하는 함수
     * 
     * @param {string} event emit event
     * @param {object | string} data broadcast해서 emit할 때 같이 보낼 데이터
     */
    broadcastEmit(event, data) {
        this.#socket.broadcast.to(this.#currentRoom).emit(event, data);
    }

    /**
     * client가 보낸 파일을 broacast해서 룸안의 전체 사람에게 보여준다
     * 
     * @param {object} data notepad 제목과 내용이 담겨있는 object
     */
    sendBroadcastFile(data) {
        this.broadcastEmit("serverSendFile", data);
    }

    /**
     * exit를 눌렀을 때 해당방에서 나가기. userList에서도 속해있던 방의 나간 유저의 이름 삭제
     */
    exit() {
        const index = this.#roomInfo[this.#currentRoom]?.indexOf(this.#userId);
        if (index > -1) {
            this.#roomInfo[this.#currentRoom].splice(index, 1);
            if (this.#roomInfo[this.#currentRoom].length === 0) delete this.#roomInfo[this.#currentRoom];
        }
        this.#socket.leave(this.#currentRoom);
        this.broadcastEmit("deleteUserId", this.#userId);
        this.#currentRoom = null;
    }

    /**
     * 기존에 Room에 참여하고 있는 사람들에게 New user정보를 전달하는 함수
     */
    informAddedUser() {
        this.broadcastEmit("addUser", this.#userId); // 새로운 유저가 들어왔다는 것을 방에 있던 사람들에게 알림
        this.sendBroadcastMessage("SYSTEM", this.#userId);
    }

    /**
     * 방에 참여했을 때 기존에 있던 방은 나가고 해당 방의 사람들에게 참여소식을 알림
     * 
     * @param {string} userId 방금 방에 참여한 유저아이디
     * @param {string} roomName 참여한 방 이름
     */
    join(userId, roomName) {
        this.#userId = userId;
        if (this.#currentRoom) this.exit(this.#userId);
        this.#currentRoom = roomName;
        this.#socket.join(roomName);

        if (this.#roomInfo[this.#currentRoom])
            this.#roomInfo[this.#currentRoom].push(this.#userId);
        else
            this.#roomInfo[this.#currentRoom] = [this.#userId];

        this.#socket.emit("getUsersInRoom", this.#roomInfo[roomName]); // 방에 참여한 유저에게 방에 있는 사람들의 목록전달
        this.informAddedUser();
    }

    /**
     * new버튼을 눌렀을 때 랜덤string값을 생성하고 생성한 랜덤값을 이름으로 하는 방에 들어간다
     * 
     * @param {string} userId 유저아이디
     */
    joinNewRoom(userId) {
        this.#userId = userId;
        let randomString;
        do {
            randomString = Math.random().toString(36).substr(2, 11);
        } while (this.#io.sockets.adapter.rooms.get(randomString));
        this.join(this.#userId, randomString);
        this.#socket.emit("getRoomName", randomString);
    }

    /**
     * send한 client 외의 룸안에 있는 전체 사람에게 메시지를 전달
     * 
     * @param {string} user 유저 아이디 
     * @param {string} text 넘길 메시지
     */
    sendBroadcastMessage(user, text) {
        this.broadcastEmit("serverSendMessage", { user, text });
    }
}
