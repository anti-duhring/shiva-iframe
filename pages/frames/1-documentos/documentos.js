import { runWithLoading } from '../../../services/loading-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const formDisablePubSub = factoryPubSub()
const dueTablePubSub = factoryPubSub()
const cctTablePubSub = factoryPubSub()

const changeDueChecked = (currentState) => {
    currentState.dueIsSelected = !currentState.dueIsSelected

    formDisablePubSub.notify(currentState)
}

const addDue = (input, currentState) => {
    const value = input.value

    if(!value) return 

    currentState.allDues.push(value)
    input.value = ''

    dueTablePubSub.notify(currentState)
}

const removeDue = (index, currentState) => {
    currentState.allDues.splice(index, 1)

    dueTablePubSub.notify(currentState)
}

const renderDues = (table, currentState) => {
    const { allDues } = currentState
    const $table_body = table.querySelector('tbody')
    const newTrs = []

    if(!allDues.length) {
        $table_body.innerHTML = ''
        $table_body.appendChild(generateEmptyTr())
        
        return
    }

    allDues.forEach((due, index) => {
        const tr = generateTr(due, () => removeDue(index, currentState))

        newTrs.push(tr)
    })

    $table_body.innerHTML = ''
    newTrs.forEach(tr => $table_body.appendChild(tr))
}

const changeCctChecked = (currentState) => {
    currentState.cctIsSelected = !currentState.cctIsSelected

    formDisablePubSub.notify(currentState)
}


const addCct = (input, currentState) => {
    const value = input.value

    if(!value) return 

    currentState.allCcts.push(value)
    input.value = ''

    cctTablePubSub.notify(currentState)
}

const removeCct = (index, currentState) => {
    currentState.allCcts.splice(index, 1)

    cctTablePubSub.notify(currentState)
}

const renderCcts = (table, currentState) => {
    const { allCcts } = currentState
    const $table_body = table.querySelector('tbody')
    const newTrs = []

    if(!allCcts.length) {
        $table_body.innerHTML = ''
        $table_body.appendChild(generateEmptyTr())
        
        return
    }

    allCcts.forEach((cct, index) => {
        const tr = generateTr(cct, () => removeCct(index, currentState))

        newTrs.push(tr)
    })

    $table_body.innerHTML = ''
    newTrs.forEach(tr => $table_body.appendChild(tr))
}

const generateTr = (content, removeFunction) => {
    const $tr = document.createElement('tr')
    const $td = document.createElement('td')
    const $td_action_buttons = document.createElement('td')
    const $delete_action_button = document.createElement('button')

    $td.textContent = content
    $tr.appendChild($td)

    $delete_action_button.classList.add('table-action-button')
    $delete_action_button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`
    $td_action_buttons.classList.add('table-action-cell')
    $td_action_buttons.appendChild($delete_action_button)

    $delete_action_button.addEventListener('click', removeFunction)

    $tr.appendChild($td_action_buttons)

    return $tr
}

const generateEmptyTr = () => {
    const $empty_tr = document.createElement('tr')
    const $empty_td = document.createElement('td')
    const $td_action_buttons = document.createElement('td')

    $empty_td.textContent = 'Nenhum item cadastrado'
    $td_action_buttons.classList.add('table-action-cell')
    $empty_tr.classList.add('form-table-empty-tr')

    $empty_tr.appendChild($empty_td)
    $empty_tr.appendChild($td_action_buttons)
    
    return $empty_tr
}

const changeFormDisable = (currentState) => {

    if(currentState.dueIsSelected) {
        document.querySelectorAll('input[name="use_cct"]').forEach(el => el.disabled = false)
        document.querySelectorAll('.due-row').forEach(el => el.style.display = 'block')
    }
    if(!currentState.dueIsSelected) {
        document.querySelectorAll('.due-row').forEach(el => el.style.display = 'none')
        document.querySelectorAll('input[name="use_cct"]').forEach(el => el.disabled = true)
        document.querySelector('#no_cct').checked = true
        currentState.cctIsSelected = false
    }

    if(currentState.cctIsSelected) {
        document.querySelectorAll('.cct-row').forEach(el => el.style.display = 'block')
    }
    if(!currentState.cctIsSelected) {
        document.querySelectorAll('.cct-row').forEach(el => el.style.display = 'none')
    }

}

const changeFooterButtonsDisable = (currentState) => {
    const $next_button = document.querySelector('#proximo')

    if((currentState.dueIsSelected && !currentState.allDues.length) || (currentState.cctIsSelected && !currentState.allCcts.length)) {
        $next_button.disabled = true

    }

}

const collapseForm = (e) => {
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


export const loadDocumentos = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/1-documentos/documentos.html', frameDiv, () => {

        const currentState = {
            dueIsSelected: true,
            allDues: [],
            cctIsSelected: true,
            allCcts: []
        }

        const $due_true_radio = frameDiv.querySelector('#yes_due')
        const $due_false_radio = frameDiv.querySelector('#no_due')
        const $due_number = frameDiv.querySelector('#due')
        const $add_due = frameDiv.querySelector('#add-due')
        const $due_table = frameDiv.querySelector('#dues')

        dueTablePubSub.subscribe((currentState) => renderDues($due_table, currentState))

        $due_true_radio.addEventListener('change', () => changeDueChecked(currentState))
        $due_false_radio.addEventListener('change', () => changeDueChecked(currentState))
        $add_due.addEventListener('click', () => addDue($due_number, currentState))

        const $cct_true_radio = frameDiv.querySelector('#yes_cct')
        const $cct_false_radio = frameDiv.querySelector('#no_cct')
        const $cct_number = frameDiv.querySelector('#cct')
        const $add_cct = frameDiv.querySelector('#add-cct')
        const $cct_table = frameDiv.querySelector('#ccts')

        cctTablePubSub.subscribe((currentState) => renderCcts($cct_table, currentState))

        $cct_true_radio.addEventListener('change', () => changeCctChecked(currentState))
        $cct_false_radio.addEventListener('change', () => changeCctChecked(currentState))

        $add_cct.addEventListener('click', () => addCct($cct_number, currentState))

        formDisablePubSub.subscribe(changeFormDisable)
        formDisablePubSub.subscribe(changeFooterButtonsDisable)

        const $collapse_buttons = frameDiv.querySelectorAll('.form-session-collapse')

        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
    })
}, 'Carregando aba "Documentos"...')