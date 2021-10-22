export default class NoteButton {
    #type;
	constructor(type) {
        this.#type = type;
    }
    get type() {
        return this.#type;
    }

    /**
	 * 버튼 생성후 생성한 버튼 반환
	 * @param {String} className 
	 * @returns Element
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