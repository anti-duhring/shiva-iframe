import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { closeModal, openAndCloseModal } from '../../../services/open-modal-service'
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

    closeModal()
}

const onHandleNextPage = (goToNextPageFn, state) => goToNextPageFn()

export const loadConteineres = (frameDiv, currentState, goToNextPageFn, goToPreviousPageFn) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/4-conteineres/conteineres.html', frameDiv, () => {
        if(!Object.keys(currentState.CONTEINERES).length) {
            // Caso o estado não tenha sido inicializado, inicializa-o com os valores padrão
            currentState.CONTEINERES = {
                data: []
            }
        } else {
            renderTablePubSub.notify(currentState.CONTEINERES.data)
        }

        const $open_modal_button = document.querySelector('[data-event="open-modal"]')
        const $add_container_buttons = document.querySelectorAll('[data-event="add-container"]')
        const $next_page_button = document.querySelector('button#proximo')
        const $back_page_button = document.querySelector('button#voltar')

        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe(data => {
            const $table = document.querySelector(`table`)
            renderTable(data, $table, (index) => onRemoveItem(index, currentState.CONTEINERES))
        })
        $open_modal_button.addEventListener('click', openAndCloseModal)
        $add_container_buttons.forEach(element => element.addEventListener('click', () => onAddItem(currentState.CONTEINERES)))
        $back_page_button.addEventListener('click', goToPreviousPageFn)
        // Substituindo botão de "Salvar e avançar" para remover todos os antigos eventListeners
        const clonedButton = $next_page_button.cloneNode(true)
        $next_page_button.parentNode.replaceChild(clonedButton, $next_page_button)
        clonedButton.addEventListener('click', () => onHandleNextPage(goToNextPageFn, currentState))
        
    })
}, 'Carregando aba "Conteineres"...')