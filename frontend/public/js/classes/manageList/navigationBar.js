import Bar from "./bar.js";

export default class NavigationBar extends Bar {
    constructor(idOfList) {
        super(idOfList);
    }

    /**
     * 리스트에 해당 아이템이 있는지
     * @param {NodeList} items 
     * @param {Number} id 
     * @returns true or false
     */
    isItemInList(items, id) {
        const val = items.values();
        for(let i = 0; i < items.length; i++) {
            if(parseInt(val.next().value.dataset.currentid) === id) {
                return true;
            }
        }
        return false;
    }
}