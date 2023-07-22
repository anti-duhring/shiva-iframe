import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { openAndCloseModal } from '../../../services/open-modal-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()

const onRemoveItem = (index, currentState) => {
    currentState.data.splice(index, 1)
    renderTablePubSub.notify(currentState.data)
}

const onAddItem = (currentState) => {
    const $data_inputs = document.querySelectorAll(`[data-input]`)

    const data = Array.from($data_inputs)
    .map(input => ({ 
        name: input.getAttribute('name'), 
        value: input.value, 
        isRequired: input.hasAttribute('required'), 
        index: input.getAttribute('data-index'),
        element: input
    })).sort((a, b) => a.index - b.index)

    if(data.some(item => item.isRequired && !item.value)) {
        data.forEach(item => {
            if(!item.isRequired) return 

            item.value ? item.element.classList.remove('form-input-error') : item.element.classList.add('form-input-error')
        })
        return
    } 

    data.forEach(item => {
        item.element.value = ''
        item.element.classList.remove('form-input-error')
    })

    currentState.data.push(data.map(item => item.value))
    renderTablePubSub.notify(currentState.data)
}

export const loadConteineres = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/4-conteineres/conteineres.html', frameDiv, () => {
        const currentState = {
            data: []
        }

        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe(data => {
            const $table = document.querySelector(`table`)
            renderTable(data, $table, (index) => onRemoveItem(index, currentState))
        })

        const $open_modal_container = document.querySelector('[data-event="open-modal"]')
        $open_modal_container.addEventListener('click', openAndCloseModal)

        const $add_container_buttons = document.querySelectorAll('[data-event="add-container"]')
        $add_container_buttons.forEach(element => element.addEventListener('click', () => onAddItem(currentState)))
        
    })
}, 'Carregando aba "Conteineres"...')