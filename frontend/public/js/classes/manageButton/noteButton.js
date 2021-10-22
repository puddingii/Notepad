export default class NoteButton {
	constructor(type) {
		this.#type = type;
	}
	#type;

	get type() {
		return this.#type;
	}

	/**
	 * 버튼 생성후 생성한 버튼 반환
	 *
	 * @param {string} className 버튼 클래스 이름
	 * @returns {Element} HTML의 버튼요소
	 */
	create(className) {
		const submitBtn = document.createElement("button");
		submitBtn.type = "button";
		submitBtn.className = className;
		submitBtn.id = this.#type;
		submitBtn.innerText = this.#type;

		return submitBtn;
	}
}