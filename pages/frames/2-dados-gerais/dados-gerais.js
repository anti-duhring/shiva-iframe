import { collapseForm } from '../../../services/collapse-form-service'
import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

const onInputChange = (e, generalDataState) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    generalDataState[property] = value
}

const onHandleNextPage = (goToNextPageFn, state) => {
    const generalDataState = state.DADOSGERAIS

    if(!generalDataState.vigiagro || !generalDataState.exporterName) {
        alert('Preencha os campos obrigatórios')
        return
    }

    goToNextPageFn()
}

const recoverFormData = (state) => {
    const $data_inputs = document.querySelectorAll('[data-input]')
    const $data_selects = document.querySelectorAll('[data-select]')

    $data_inputs.forEach(el => {
        const property = el.getAttribute('data-property')
        el.value = state[property]
    })
    $data_selects.forEach(el => {
        const property = el.getAttribute('data-property')
        for (let i = 0; i < el.options.length; i++) {
            if (el.options[i].value === state[property]) {
                el.options[i].selected = true;
              break;
            }
        }
    
    })
}

const handleSelectChange = (e, state) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    state.DADOSGERAIS[property] = value

}

export const loadDadosGerais = (frameDiv, currentState, goToNextPageFn, goToPreviousPageFn) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/2-dados-gerais/dados-gerais.html', frameDiv, () => {
        if(!Object.keys(currentState.DADOSGERAIS).length) {
            // Caso o estado não tenha sido inicializado, inicializa-o com os valores padrão
            currentState.DADOSGERAIS = {
                vigiagro: null,
                exporterName: null,
                exporterAddress: null
            }
        } else {
            recoverFormData(currentState.DADOSGERAIS)
        }


        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')
        const $data_inputs = document.querySelectorAll('[data-input]')
        const $next_page_button = document.querySelector('button#proximo')
        const $back_page_button = document.querySelector('button#voltar')
        const $selects = document.querySelectorAll('[data-select]')

        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
        $data_inputs.forEach(el => el.addEventListener('input', e => onInputChange(e, currentState.DADOSGERAIS)))
        $back_page_button.addEventListener('click', goToPreviousPageFn)
        // Substituindo botão de "Salvar e avançar" para remover todos os antigos eventListeners
        const clonedButton = $next_page_button.cloneNode(true)
        $next_page_button.parentNode.replaceChild(clonedButton, $next_page_button)
        clonedButton.addEventListener('click', () => onHandleNextPage(goToNextPageFn, currentState))
        $selects.forEach(el => el.addEventListener('change', e => handleSelectChange(e, currentState)))

    })
}, 'Carregando aba "Dados Gerais"...')