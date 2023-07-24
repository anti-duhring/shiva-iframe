export const recoverFormData = (state) => {
    const $data_inputs = document.querySelectorAll('[data-input][data-property]')
    const $data_selects = document.querySelectorAll('[data-select][data-property]')

    $data_inputs.forEach(el => {
        const property = el.getAttribute('data-property')
        el.value = state[property]
    })
    $data_selects.forEach(el => {
        const property = el.getAttribute('data-property')
        for (let i = 0; i < el.options.length; i++) {
            if (el.options[i].value === state[property]) {
                el.options[i].selected = true;
              break;
            }
        }
    
    })
}