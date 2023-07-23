import { collapseForm } from '../../../services/collapse-form-service'
import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

const onInputChange = (e, generalDataState) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    generalDataState[property] = value
}

export const loadDadosGerais = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/2-dados-gerais/dados-gerais.html', frameDiv, () => {
        currentState.DADOSGERAIS = {
            vigiagro: null,
            exporterName: null,
            exporterAddress: null
        }

        const generalDataState = currentState.DOCUMENTOS

        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')
        const $data_inputs = document.querySelectorAll('[data-input]')

        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
        $data_inputs.forEach(el => el.addEventListener('input', e => onInputChange(e, generalDataState)))

    })
}, 'Carregando aba "Dados Gerais"...')