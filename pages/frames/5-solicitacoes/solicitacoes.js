import { runWithLoading } from '../../../services/loading-service'
import { closeModal, openAndCloseModal } from '../../../services/open-modal-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()

const onAddItem = (state) => {
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

    state.data.push(data.map(item => item.value))
    renderTablePubSub.notify(state.data)

    closeModal()
}

export const loadSolicitacoes = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/5-solicitacoes/solicitacoes.html', frameDiv, () => {
        currentState.SOLICITACOES = {
            data: []
        }

        const solicitacoesState = currentState.SOLICITACOES
        const $open_modal_button = document.querySelector('[data-event="open-modal"]')
        const $add_request_button = document.querySelectorAll('[data-event="add-container"]')

        $open_modal_button.addEventListener('click', openAndCloseModal)
        $add_request_button.forEach(button => button.addEventListener('click', () => onAddItem(solicitacoesState)))

    })
}, 'Carregando aba "Solicitações"...')