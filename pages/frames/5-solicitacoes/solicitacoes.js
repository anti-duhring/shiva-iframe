import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { closeModal, openAndCloseModal, openModal } from '../../../services/open-modal-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const renderTablePubSub = factoryPubSub()



const onAddItem = (state) => {
    const actionType = document.querySelector('dialog').getAttribute('data-action-type')

    if(actionType === 'edit') {
        confirmEditItem(state)
        return
    }

    const { currentRequest } = state
    const $inputs = document.querySelectorAll(`[data-input]`)
    const $selects = document.querySelectorAll(`[data-select]`)
    const $data_inputs = [...$inputs, ...$selects]

    const data = Array.from($data_inputs)
    .map(input => ({ 
        name: input.getAttribute('name'), 
        value: input.value, 
        isRequired: input.hasAttribute('required'), 
        index: Number(input.getAttribute('data-index')) || 0,
        element: input
    })).sort((a, b) => a.index - b.index)

    if(data.some(item => item.isRequired && !item.value)) {
        data.forEach(item => {
            if(!item.isRequired) return 

            item.value ? item.element.classList.remove('form-input-error') : item.element.classList.add('form-input-error')
        })
        return
    } 

    data.forEach(item => item.element.classList.remove('form-input-error'))

    $inputs.forEach(input => input.value = '')
    $selects.forEach(select => {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === '') {
                select.options[i].selected = true;
              break;
            }
        }
    })

    state.data.push({...currentRequest})
    renderTablePubSub.notify(state.data)

    console.log(state.data)
    closeModal()
}

const onRemoveItem = (index, state) => {
    state.data.splice(index, 1)
    renderTablePubSub.notify(state.data)
}

const onEditItem = (index, state) => {
    const dialog = document.querySelector('dialog')
    dialog.setAttribute('data-action-type', 'edit')

    const item = state.data[index]
    state.currentRequest = {...item}
    state.currentRequestIndex = index

    openModal()
    fillFormWithCurrentRequest(state)
    document.querySelector('[data-event="add-container"]').textContent = 'Salvar'
    document.querySelector('.modal-title h2').textContent = 'Editar solicitação'
}

const confirmEditItem = (state) => {
    const { currentRequest, currentRequestIndex } = state
    state.data[currentRequestIndex] = {...currentRequest}

    state.currentRequestIndex = 0
    renderTablePubSub.notify(state.data)

    closeModal()
    const dialog = document.querySelector('dialog')
    dialog.setAttribute('data-action-type', 'add')
    $inputs.forEach(input => input.value = '')
    $selects.forEach(select => {
        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === '') {
                select.options[i].selected = true;
              break;
            }
        }
    })
}

const handleInputChange = (e, state) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    state.SOLICITACOES.currentRequest[property] = value
}

const handleRadioInputChange = (e, state) => {
    const { value } = e.target
    const property = e.target.getAttribute('data-property')

    state.SOLICITACOES.currentRequest[property] = JSON.parse(value)
}

const fillFormWithCurrentRequest = (state) => {
    const { currentRequest } = state
    const $inputs = document.querySelectorAll(`[data-input]`)
    const $selects = document.querySelectorAll(`[data-select]`)

    $inputs.forEach(input => {
        const property = input.getAttribute('data-property')
        input.value = currentRequest[property]
    })

    $selects.forEach(select => {
        const property = select.getAttribute('data-property')

        for (let i = 0; i < select.options.length; i++) {
            if (select.options[i].value === currentRequest[property]) {
                select.options[i].selected = true;
              break;
            }
        }
    })
}

export const loadSolicitacoes = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/5-solicitacoes/solicitacoes.html', frameDiv, () => {
        if(!Object.keys(currentState.TRANSPORTES).length) {
            // Caso o estado não tenha sido inicializado, inicializa-o com os valores padrão
            currentState.SOLICITACOES = {
                data: [],
                // Ao abrir o modal (tanto pra criação de uma nova solicitação quanto pra edição), todos os dados preenchidos estarão armazenados dentro desse objeto até o momento que o usuário clicar no botão "cancelar" ou "enviar", então o objeto será descartado ou será inserido dentro da array data
                currentRequest: {
                    destinyCountry: null,
                    transitingCountry: null,
                    recipientIsTheImporter: true,
                    recipientName: null,
                    recipientAddress: null,
                    originCountry: null,
                    originState: null,
                    originCity: null,
                    entryPoint: null,
                    volumeDescription: null,
                    volumeNumber: null,
                    otherVolumeDescriptionAndNumber: null,
                    productSelectionIsAvaliable: true,
                    ncm: null,
                    product: null,
                    vegetablePiece: null,
                    usageIntent: null,
                    condition: null,
                    additionalDescription: null,
                    netWeight: null,
                    netWeightUnit: null,
                    grossWeight: null,
                    grossWeightUnit: null,
                    anotherAmount: null,
                    anotherAmountUnit: null,
                    distinctiveMarks: null,
                    importPermission: null
                },
                currentRequestIndex: null
            }
        }

        const $open_modal_button = document.querySelector('[data-event="open-modal"]')
        const $add_request_button = document.querySelectorAll('[data-event="add-container"]')
        const $all_input_form_fields = document.querySelectorAll('[data-input]')
        const $all_select_form_fields = document.querySelectorAll('[data-select]')
        const $all_radio_form_fields = document.querySelectorAll('[data-radio]')
        const $all_form_fields = [...$all_input_form_fields, ...$all_select_form_fields]

        $open_modal_button.addEventListener('click', () => {
            openAndCloseModal()
            document.querySelector('[data-event="add-container"]').textContent = 'Adicionar'
            document.querySelector('.modal-title h2').textContent = 'Adicionar solicitação'
        })
        $add_request_button.forEach(button => button.addEventListener('click', () => onAddItem(currentState.SOLICITACOES)))
        $all_form_fields.forEach(field => field.addEventListener('change', e => handleInputChange(e, currentState)))
        $all_radio_form_fields.forEach(field => field.addEventListener('change', e => handleRadioInputChange(e, currentState)))
        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe(data => {
            const dataToBeShowedOnTheTable = data.map((item, index) => [index + 1, item.product, item.recipientName, item.originCountry])
            const $table = document.querySelector(`table`)
            
            renderTable(
                dataToBeShowedOnTheTable, 
                $table, 
                (index) => onRemoveItem(index, currentState.SOLICITACOES),
                (index) => onEditItem(index, currentState.SOLICITACOES)
            )
        })

    })
}, 'Carregando aba "Solicitações"...')