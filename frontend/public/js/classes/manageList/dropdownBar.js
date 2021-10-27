import Bar from "./bar.js";

export default class DropdownBar extends Bar {
	constructor(idList) {
		super(idList);
	}

	/**
	 * Dropdown Bar의 아이템 셋팅을 위한 추가적인 초기화
	 *
	 * @override
	 * @param {object} itemInfo HTML li element 정보(id, className 등)
	 * @param {object} linkInfo HTML a element 정보(id, className 등)
	 * @returns {Element} li element 반환
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
	 * @param {number} id Dropdown안의 삭제할 요소 아이디
	 */
	deleteItem(id) {
		const dropdownItems = this.myList.querySelectorAll("li");
		dropdownItems.forEach((item) => {
			if (parseInt(item.dataset.currentid) === id) item.remove();
		});
	}
}