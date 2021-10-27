import Bar from "./bar.js";

export default class NavigationBar extends Bar {
    constructor(idList) {
        super(idList);
    }

    /**
     * 리스트에 해당 아이템이 있는지
     *
     * @param {NodeList} items NavigationBar안의 모든 요소
     * @param {number} id NavigationBar안의 확인할 요소 아이디
     * @returns {boolean} true or false
     */
    isItemInBar(items, id) {
        const val = items.values();
        for (let i = 0; i < items.length; i++) {
            if (parseInt(val.next().value.dataset.currentid) === id) {
                return true;
            }
        }
        return false;
    }
}