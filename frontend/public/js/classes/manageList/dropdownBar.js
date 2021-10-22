import Bar from "./bar.js";

export default class DropdownBar extends Bar {
	constructor(idOfList) {
		super(idOfList);
	}

	/**
	 * Dropdown Bar의 아이템 셋팅을 위한 추가적인 초기화
	 *
	 * @override
	 * @param {object} itemInfo 
	 * @param {object} linkInfo 
	 * @returns 
	 */
	createItem(itemInfo, linkInfo) {
		const dropdownItems = this.myList.querySelectorAll("a");
		let isExisted = false;
		dropdownItems.forEach((item) => {
			if (parseInt(item.dataset.currentid) === itemInfo.dataset.value) isExisted = true;
		});
		if (isExisted) return;

		return super.createItem(itemInfo, linkInfo);
	}

	/**
	 * Dropdown에 있는 아이템 삭제
	 *
	 * @param {number} id 
	 */
	deleteItem(id) {
		const dropdownItems = this.myList.querySelectorAll("li");
		dropdownItems.forEach((item) => {
			if (parseInt(item.dataset.currentid) === id) item.remove();
		});
	}
}