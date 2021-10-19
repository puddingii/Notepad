import MyList from "./myList.js";

export default class NavBar extends MyList {
    constructor(idOfList) {
        super(idOfList);
    }

    // 리스트에 해당 아이템이 있는지
    isItemInList(items, id) {
        let isTitleInList = false;
        items.forEach((element) => {
            if(parseInt(element.dataset.currentid) === id) {
                isTitleInList = true;
                return;
            }
        });
        return isTitleInList;
    }
}