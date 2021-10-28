/* eslint-disable no-undef */
import { MyWindow } from "./classes/myWindow.js";
import Chat from "./classes/manageSocket/chat.js";

(async () => {
    const currentUserId = document.getElementById("currentUserId").innerText;
    const testWindow = new MyWindow(currentUserId);
    await testWindow.init();
    testWindow.logout("logout");
    const myChat = new Chat(currentUserId);
    myChat.initActions();
})();
$(function () {
    $(".sortable").sortable({
        items: "li.notetab"
    });
});