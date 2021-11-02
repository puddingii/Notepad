/* eslint-disable no-undef */
import { MyWindow } from "./classes/myWindow.js";

(async () => {
    const currentUserId = document.getElementById("currentUserId").innerText;
    const myWindow = new MyWindow(currentUserId);
    await myWindow.initNotepad();
    myWindow.initChat();
    myWindow.setLogout("logout");
    myWindow.setShare();
    var popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function (popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });
    $(function () {
        $(".sortable").sortable({
            items: "li.notetab"
        });
        $("#chatRecordBoard").droppable({
            drop: function (event, ui) {
                const eventTitle = ui.draggable[0].querySelector(".notelink").innerText;
                myWindow.sendFile(eventTitle);
            }
        });
    });
})();
