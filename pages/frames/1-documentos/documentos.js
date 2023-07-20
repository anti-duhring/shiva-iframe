import { runWithLoading } from '../../../services/loading-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const duoPubSub = factoryPubSub()

const changeDueChecked = (currentState) => currentState.dueIsSelected = !currentState.dueIsSelected

const addDue = (input, currentState) => {
    const value = input.value

    if(!value) return 

    currentState.allDues.push(value)
    input.value = ''

    duoPubSub.notify(currentState.allDues)
}

const removeDuo = (index, allDues) => {
    allDues.splice(index, 1)

    duoPubSub.notify(allDues)
}

const renderDuos = (table, allDues) => {
    const $table_body = table.querySelector('tbody')
    const newTrs = []

    allDues.forEach((due, index) => {
        const $tr = document.createElement('tr')
        const $td = document.createElement('td')
        const $td_action_buttons = document.createElement('td')
        const $delete_action_button = document.createElement('button')

        $td.textContent = due
        $tr.appendChild($td)
    
        $delete_action_button.classList.add('table-action-button')
        $delete_action_button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`
        $td_action_buttons.classList.add('table-action-cell')
        $td_action_buttons.appendChild($delete_action_button)

        $delete_action_button.addEventListener('click', () => removeDuo(index, allDues))

        $tr.appendChild($td_action_buttons)
        newTrs.push($tr)
    })

    $table_body.innerHTML = ''
    newTrs.forEach(tr => $table_body.appendChild(tr))
}

export const loadDocumentos = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/1-documentos/documentos.html', frameDiv, () => {

        const currentState = {
            dueIsSelected: true,
            allDues: []
        }

        const $due_true_radio = frameDiv.querySelector('#yes_due')
        const $due_false_radio = frameDiv.querySelector('#no_due')
        const $due_number = frameDiv.querySelector('#due')
        const $add_due = frameDiv.querySelector('#add-due')
        const $due_table = frameDiv.querySelector('#dues')

        duoPubSub.subscribe((...args) => renderDuos($due_table, ...args))

        $due_true_radio.addEventListener('change', () => changeDueChecked(currentState))
        $due_false_radio.addEventListener('change', () => changeDueChecked(currentState))
        $add_due.addEventListener('click', () => addDue($due_number, currentState))

    })
}, 'Carregando aba "Documentos"...')