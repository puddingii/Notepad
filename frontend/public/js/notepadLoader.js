/* eslint-disable no-undef */
import { MyWindow } from "./classes/myWindow.js";

(async () => {
    const currentUserId = document.getElementById("currentUserId").innerText;
    const testWindow = new MyWindow(currentUserId);
    await testWindow.init();
    testWindow.logout("logout");
})();
$(function () {
    $(".sortable").sortable({
        items: "li.notetab"
    });
});