import { collapseForm } from '../../../services/collapse-form-service'
import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { recoverFormData } from '../../../services/recover-form-data-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()

const renderFormFromTransportType = (transportType) => {
    const allElements = document.querySelectorAll(`[data-transport]`)
    allElements.forEach(element => element.classList.add('form-hidden'))

    const elementsFromThisTransportType = document.querySelectorAll(`[data-transport="${transportType}"]`)
    elementsFromThisTransportType.forEach(element => element.classList.remove('form-hidden'))
}

const onChangeTransportType = (e, transportState) => {
    transportState.transportType = e.target.value
    transportState.data = []

    renderTablePubSub.notify(transportState.transportType, transportState.data)
}

const onRemoveItem = (index, transportState) => {
    transportState.data.splice(index, 1)
    renderTablePubSub.notify(transportState.transportType, transportState.data)
}

const onAddItem = (e, transportState) => {
    const transportType = e.target.getAttribute('data-transport')
    const $data_inputs = document.querySelectorAll(`[data-transport="${transportType}"][data-input]`)

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

    transportState.data.push(data.map(item => item.value))
    renderTablePubSub.notify(transportType, transportState.data)
}

const onInputChange = (e, transportState) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    transportState[property] = value
}

const handleSelectChange = (e, state) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    state.TRANSPORTES[property] = value

}

const onHandleNextPage = (goToNextPageFn, state) => {
    const transportState = state.TRANSPORTES

    if(!transportState.transportType || !transportState.loadingType || !transportState.data.length) {
        alert('Preencha os campos obrigatórios')
        return
    }

    if(transportState.transportType === 'transport-road' && !transportState.vehicleType) {
        alert('Preencha os campos obrigatórios')
        return
    }

    goToNextPageFn()
}

export const loadTransportes = (frameDiv, currentState, goToNextPageFn, goToPreviousPageFn) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/3-transportes/transportes.html', frameDiv, () => {
        if(!Object.keys(currentState.TRANSPORTES).length) {
            // Caso o estado não tenha sido inicializado, inicializa-o com os valores padrão
            currentState.TRANSPORTES = {
                _transportType: 'transport-rail',
                get transportType() {
                    return this._transportType
                },
                // Sempre que o tipo de transporte mudar, o estado deve ser atualizado e todos os campos que não sejam referentes a esse tipo de transporte devem desaparecer
                set transportType(value) {
                    this._transportType = value
                    renderFormFromTransportType(value)
                },
                data: [],
                loadingType: null,
                vehicleType: null,
                horsePlate: null
            }
        } else {
            recoverFormData(currentState.TRANSPORTES)
            renderTablePubSub.notify(currentState.TRANSPORTES.transportType, currentState.TRANSPORTES.data)
        }

        const $transport_type = document.querySelector('#transport-type')
        const $add_transport_buttons = document.querySelectorAll('[data-event="add-transport"]')
        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')
        const $data_inputs_that_change_properties_from_state = document.querySelectorAll('[data-input][data-property]')
        const $next_page_button = document.querySelector('button#proximo')
        const $back_page_button = document.querySelector('button#voltar')
        const $selects = document.querySelectorAll('[data-select]')

        renderFormFromTransportType(currentState.TRANSPORTES.transportType)
        $transport_type.addEventListener('change', (e) => onChangeTransportType(e, currentState.TRANSPORTES))
        $add_transport_buttons.forEach(element => element.addEventListener('click', (e) => onAddItem(e, currentState.TRANSPORTES)))
        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe((transportType, data) => {
            const $table = document.querySelector(`table[data-transport="${transportType}"]`)
            
            renderTable(data, $table, (index) => onRemoveItem(index, currentState.TRANSPORTES))
        })
        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
        $data_inputs_that_change_properties_from_state.forEach(el => el.addEventListener('input', e => onInputChange(e, currentState.TRANSPORTES)))
        $back_page_button.addEventListener('click', goToPreviousPageFn)
        // Substituindo botão de "Salvar e avançar" para remover todos os antigos eventListeners
        const clonedButton = $next_page_button.cloneNode(true)
        $next_page_button.parentNode.replaceChild(clonedButton, $next_page_button)
        clonedButton.addEventListener('click', () => onHandleNextPage(goToNextPageFn, currentState))
        $selects.forEach(el => el.addEventListener('change', e => handleSelectChange(e, currentState)))

    })
}, 'Carregando aba "Transportes"...')