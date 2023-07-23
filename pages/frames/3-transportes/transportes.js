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

export const loadTransportes = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/3-transportes/transportes.html', frameDiv, () => {
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

        const transportState = currentState.TRANSPORTES
        const $transport_type = document.querySelector('#transport-type')
        const $add_transport_buttons = document.querySelectorAll('[data-event="add-transport"]')
        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')
        const $data_inputs_that_change_properties_from_state = document.querySelectorAll('[data-input][data-property]')

        renderFormFromTransportType(transportState.transportType)
        $transport_type.addEventListener('change', (e) => onChangeTransportType(e, transportState))
        $add_transport_buttons.forEach(element => element.addEventListener('click', (e) => onAddItem(e, transportState)))
        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe((transportType, data) => {
            const $table = document.querySelector(`table[data-transport="${transportType}"]`)
            
            renderTable(data, $table, (index) => onRemoveItem(index, transportState))
        })
        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
        $data_inputs_that_change_properties_from_state.forEach(el => el.addEventListener('input', e => onInputChange(e, transportState)))

    })
}, 'Carregando aba "Transportes"...')