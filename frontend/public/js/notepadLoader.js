/* eslint-disable no-undef */
import { MyWindow } from "./classes/myWindow.js";

(async () => {
    const currentUserId = document.getElementById("currentUserId").innerText;
    const myWindow = new MyWindow(currentUserId);
    await myWindow.initNotepad();
    myWindow.initChat();
    myWindow.setLogout("logout");
    myWindow.setShare();
})();
$(function () {
    $(".sortable").sortable({
        items: "li.notetab"
    });
});