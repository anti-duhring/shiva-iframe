import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { openAndCloseModal } from '../../../services/open-modal-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()

const onRemoveItem = (index, containersState) => {
    containersState.data.splice(index, 1)
    renderTablePubSub.notify(containersState.data)
}

const onAddItem = (containersState) => {
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

    containersState.data.push(data.map(item => item.value))
    renderTablePubSub.notify(containersState.data)
}

export const loadConteineres = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/4-conteineres/conteineres.html', frameDiv, () => {
        currentState.CONTEINERES = {
            data: []
        }

        const containersState = currentState.CONTEINERES
        const $open_modal_container = document.querySelector('[data-event="open-modal"]')
        const $add_container_buttons = document.querySelectorAll('[data-event="add-container"]')

        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe(data => {
            const $table = document.querySelector(`table`)
            renderTable(data, $table, (index) => onRemoveItem(index, containersState))
        })
        $open_modal_container.addEventListener('click', openAndCloseModal)
        $add_container_buttons.forEach(element => element.addEventListener('click', () => onAddItem(containersState)))
        
    })
}, 'Carregando aba "Conteineres"...')