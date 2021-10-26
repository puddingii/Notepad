export default class Bar {
    constructor(idOfList) {
        this.#idOfList = idOfList;
        this.#myList = document.getElementById(idOfList);
    }
    #myList;
    #idOfList;

    get idOfList() {
        return this.#idOfList;
    }

    get myList() {
        return this.#myList;
    }

    /**
     * Bar안에 넣을 아이템 생성
     *
     * @param {object} itemInfo HTML li element 정보(id, className 등)
     * @param {object} linkInfo HTML a element 정보(id, className 등)
     * @returns {Element} li Element반환
     */
    createItem(itemInfo, linkInfo) {
        if (!itemInfo) return;
        const item = document.createElement("li");
        item.className = itemInfo.className;
        item.id = itemInfo.id;
        if (itemInfo.dataset.key) item.dataset[itemInfo.dataset.key] = itemInfo.dataset.value;

        const itemLink = document.createElement("a");
        itemLink.className = linkInfo.className;
        itemLink.id = linkInfo.id;
        itemLink.innerText = linkInfo.text;
        itemLink.href = linkInfo.href;
        if (linkInfo.dataset.key) itemLink.dataset[linkInfo.dataset.key] = linkInfo.dataset.value;
        item.appendChild(itemLink);

        return item;
    }

    /**
     * CSS 스타일 적용을 위한 class 처리
     *
     * @param {number} targetId 클릭된 아이템의 이름
     * @param {string} classOfItems Bar안의 아이템의 클래스 이름
     */
    toggleItem(targetId, classOfItems) {
        const noteLinks = document.querySelectorAll(classOfItems);
        noteLinks.forEach((notelink) => {
            if (targetId !== notelink.id) {
                notelink.classList.remove("active");
            } else {
                notelink.classList.add("active");
            }
        });
    }

    /**
     * Bar에 가져온 아이템 추가
     *
     * @param {Element} item Bar안에 추가될 아이템
     */
    addItem(item) {
        this.#myList.appendChild(item);
    }
}