import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

const renderFormFromTransportType = (transportType) => {
    const allElements = document.querySelectorAll(`[data-transport]`)
    allElements.forEach(element => element.classList.add('form-hidden'))

    const elementsFromThisTransportType = document.querySelectorAll(`[data-transport="${transportType}"]`)
    elementsFromThisTransportType.forEach(element => element.classList.remove('form-hidden'))
}

const onChangeTransportType = (e, currentState) => {
    currentState.transportType = e.target.value
}
export const loadTransportes = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/3-transportes/transportes.html', frameDiv, () => {
        const currentState = {
            _transportType: 'transport-rail',
            get transportType() {
                return this._transportType
            },
            set transportType(value) {
                this._transportType = value
                renderFormFromTransportType(value)
            }
        }

        renderFormFromTransportType(currentState.transportType)

        const $transport_type = document.querySelector('#transport-type')
        $transport_type.addEventListener('change', (e) => onChangeTransportType(e, currentState));
    })
}, 'Carregando aba "Transportes"...')