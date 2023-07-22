export const collapseForm = (e) => {
    const $form_session = e.target.closest('.form-session')
    const $form_session_content = $form_session.querySelector('.form-session-content')

    const expandIcon = '<path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"></path>'
    const collapseIcon = '<path d="M2 12h20" stroke="#FFFFFF" stroke-width="2" />'

    if($form_session_content.style.display === 'none') {
        $form_session_content.style.display = 'block'
        e.target.innerHTML = collapseIcon
    } else {
        $form_session_content.style.display = 'none'
        e.target.innerHTML = expandIcon
    }
}