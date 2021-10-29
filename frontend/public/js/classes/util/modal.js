export default class Modal {
    constructor(modalId) {
        this.#modal = document.getElementById(modalId);
    }
    #modal;
    init() {
        this.#modal.addEventListener("show.bs.modal", (event) => {
            // Button that triggered the modal
            const button = event.relatedTarget;
            // Extract info from data-bs-* attributes
            const recipient = button.getAttribute('data-bs-whatever');
            // If necessary, you could initiate an AJAX request here
            // and then do the updating in a callback.
            //
            // Update the modal's content.
            const modalTitle = this.#modal.querySelector('.modal-title');
            const modalBodyInput = this.#modal.querySelector('.modal-body input');

            // modalTitle.textContent = 'New message to ' + recipient;
            // modalBodyInput.value = recipient;
        });
    }
}