const socketController = (socket) => {
    socket.on("clientWrite", (user, text) => {
        socket.broadcast.emit("serverWrite", { user, text });
    });
};

export default socketController;