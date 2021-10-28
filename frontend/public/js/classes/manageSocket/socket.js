/*global io*/

export default class Socket {

    constructor() {
        console.log("11");
        this.#socket = io();
        console.log("22");
    }
    #socket;

    initActions() {
        this.#socket.emit("clientHello", "clientHello11");
    }
}
