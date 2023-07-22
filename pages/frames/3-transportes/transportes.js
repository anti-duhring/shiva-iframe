import { collapseForm } from '../../../services/collapse-form-service'
import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()

const renderFormFromTransportType = (transportType) => {
    const allElements = document.querySelectorAll(`[data-transport]`)
    allElements.forEach(element => element.classList.add('form-hidden'))

    const elementsFromThisTransportType = document.querySelectorAll(`[data-transport="${transportType}"]`)
    elementsFromThisTransportType.forEach(element => element.classList.remove('form-hidden'))
}

const onChangeTransportType = (e, currentState) => {
    currentState.transportType = e.target.value
    currentState.data = []

    renderTablePubSub.notify(currentState.transportType, currentState.data)
}

const onRemoveItem = (index, currentState) => {
    currentState.data.splice(index, 1)
    renderTablePubSub.notify(currentState.transportType, currentState.data)
}

const onAddItem = (e, currentState) => {
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

    currentState.data.push(data.map(item => item.value))
    renderTablePubSub.notify(transportType, currentState.data)
}
export const loadTransportes = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/3-transportes/transportes.html', frameDiv, () => {
        const currentState = {
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
        }

        renderFormFromTransportType(currentState.transportType)

        const $transport_type = document.querySelector('#transport-type')
        $transport_type.addEventListener('change', (e) => onChangeTransportType(e, currentState))

        const $add_transport_buttons = document.querySelectorAll('[data-event="add-transport"]')
        $add_transport_buttons.forEach(element => element.addEventListener('click', (e) => onAddItem(e, currentState)))

        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe((transportType, data) => {
            const $table = document.querySelector(`table[data-transport="${transportType}"]`)
            
            renderTable(data, $table, (index) => onRemoveItem(index, currentState))
        })

        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')

        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))

    })
}, 'Carregando aba "Transportes"...')