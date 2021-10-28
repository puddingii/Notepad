const socketController = (socket) => {
    socket.on("clientHello", (test) => {
        console.log("serverHello");
        console.log(test);
    });
    socket.on("clientWrite", (user, text) => {
        console.log(user, text);
        socket.broadcast.emit("serverWrite", { user, text });
    });
};

export default socketController;