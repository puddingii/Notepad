import MyList from "./myList.js";

export default class DropdownList extends MyList {
    constructor(idOfList) {
        super(idOfList);
    }

	initItem(itemInfo, linkInfo) { 
		const dropdownItems = this.myList.querySelectorAll("a");
		let isExisted = false;
		dropdownItems.forEach((item) => { 
			if(parseInt(item.dataset.currentid) === itemInfo.dataset.value) isExisted = true;
		});
		if(isExisted) return;

		return super.initItem(itemInfo, linkInfo);
	}

	// Dropdown에 있는 아이템 삭제 *
	deleteDropdownItem(id) {
		const dropdownItems = this.myList.querySelectorAll("li");
		dropdownItems.forEach((item) => { 
			if(parseInt(item.dataset.currentid) === id) item.remove();
		});
	}
}