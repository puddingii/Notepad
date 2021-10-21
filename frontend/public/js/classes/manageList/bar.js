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

    initItem(itemInfo, linkInfo) {
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

    // list 토글 기능만 있음.
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

    addItemAtList(item) {
        this.#myList.appendChild(item);
    }
}