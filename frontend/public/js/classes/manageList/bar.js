export default class Bar {
    #myList;
    #idOfList;
    constructor(idOfList) {
        this.#idOfList = idOfList;
        this.#myList = document.getElementById(idOfList);
    }
    get idOfList() {
        return this.#idOfList;
    }
    get myList() {
        return this.#myList;
    }

    /**
     * Bar안에 넣을 아이템 생성
     * @param {Object} itemInfo 
     * @param {Object} linkInfo 
     * @returns li Element반환
     */
    createItem(itemInfo, linkInfo) {
        if(!itemInfo) return;
        const item = document.createElement("li");
        item.className = itemInfo.className;
        item.id = itemInfo.id;
        if(itemInfo.dataset.key) item.dataset[itemInfo.dataset.key] = itemInfo.dataset.value;

        const itemLink = document.createElement("a");
        itemLink.className = linkInfo.className;
        itemLink.id = linkInfo.id;
        itemLink.innerText = linkInfo.text;
        itemLink.href = linkInfo.href;
        if(linkInfo.dataset.key) itemLink.dataset[linkInfo.dataset.key] = linkInfo.dataset.value;
        item.appendChild(itemLink);

        return item;
    }

    /**
     * CSS 스타일 적용을 위한 class 처리
     * @param {Number} eventTarget 
     * @param {String} classOfItems 
     */
	toggleItem(eventTarget, classOfItems) {
		const noteLinks = document.querySelectorAll(classOfItems); 
		noteLinks.forEach((notelink) => {
			if(eventTarget !== notelink.id) {
				notelink.classList.remove("active");
			} else {
				notelink.classList.add("active");
			}
		})
    }

    /**
     * Bar에 가져온 아이템 추가
     * @param {Element} item 
     */
    addItem(item) {
        this.#myList.appendChild(item);
    }
}