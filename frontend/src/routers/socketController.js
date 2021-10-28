const socketController = (socket) => {
    socket.on("clientHello", () => console.log("serverHello"));
};

export default socketController;