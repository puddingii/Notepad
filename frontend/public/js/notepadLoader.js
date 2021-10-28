/* eslint-disable no-undef */
import { MyWindow } from "./classes/myWindow.js";
import Socket from "./classes/manageSocket/socket.js";

(async () => {
    const currentUserId = document.getElementById("currentUserId").innerText;
    const testWindow = new MyWindow(currentUserId);
    await testWindow.init();
    testWindow.logout("logout");
    const mySocket = new Socket();
    mySocket.initActions();
})();
$(function () {
    $(".sortable").sortable({
        items: "li.notetab"
    });
});