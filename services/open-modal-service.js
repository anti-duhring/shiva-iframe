const closeModal = () => {
    const $modal = document.querySelector('dialog.form-modal');
    const $overlay = document.querySelector('div.modal-overlay');
    $modal.removeAttribute('open');
    $overlay.style.display = 'none';
}

export const openAndCloseModal = () => {
    const $modal = document.querySelector('dialog.form-modal');
    const $overlay = document.querySelector('div.modal-overlay');
    const $closeModal = document.querySelectorAll('[data-event="close-modal"]');

    if($modal.getAttribute('open') === 'true') {
        $modal.removeAttribute('open');
        $overlay.style.display = 'none';

        $closeModal.forEach(item => item.removeEventListener('click', closeModal))
    } else {
        $modal.setAttribute('open', 'true');
        $overlay.style.display = 'block';

        $closeModal.forEach(item => item.addEventListener('click', closeModal)) 
    }


}