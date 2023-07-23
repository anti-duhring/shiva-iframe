import { collapseForm } from '../../../services/collapse-form-service'
import { renderTable } from '../../../services/form-table-service'
import { runWithLoading } from '../../../services/loading-service'
import { factoryPubSub } from '../../../services/pub-sub-service'
import { frameLoad } from '../../../services/requests-service'

const formDisablePubSub = factoryPubSub()
const renderTablePubSub = factoryPubSub()

const changeFormDisable = (e, documentsState) => {
    const documentType = e.target.getAttribute('data-document-type')
    const documentTypeIsEnabled = JSON.parse(e.target.getAttribute('data-document-type-enable'))

    documentsState[`${documentType}IsSelected`] = documentTypeIsEnabled

    if(documentsState.dueIsSelected) {
        document.querySelectorAll('input[name="use_cct"]').forEach(el => el.disabled = false)
        document.querySelectorAll('.due-row').forEach(el => el.style.display = 'block')
    }
    if(!documentsState.dueIsSelected) {
        document.querySelectorAll('.due-row').forEach(el => el.style.display = 'none')
        document.querySelectorAll('input[name="use_cct"]').forEach(el => el.disabled = true)
        document.querySelector('#no_cct').checked = true
        documentsState.cctIsSelected = false
    }

    if(documentsState.cctIsSelected) {
        document.querySelectorAll('.cct-row').forEach(el => el.style.display = 'block')
    }
    if(!documentsState.cctIsSelected) {
        document.querySelectorAll('.cct-row').forEach(el => el.style.display = 'none')
    }

}

const onAddItem = (e, documentsState) => {
    const documentType = e.target.getAttribute('data-document-type')
    const $data_inputs = document.querySelectorAll(`[data-document-type="${documentType}"][data-input]`)

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

    documentsState[documentType].push(data.map(item => item.value))
    renderTablePubSub.notify(documentType, documentsState[documentType])
}

const onRemoveItem = (index, documentsState, documentType) => {
    documentsState[documentType].splice(index, 1)

    renderTablePubSub.notify(documentType, documentsState[documentType])
}

const renderSelectOptions = (documentType, data) => {
    const $select = document.querySelector(`[data-document-type="${documentType}"][data-select]`)

    const $empty_option = document.createElement('option')
    $empty_option.value = ''
    $empty_option.innerText = 'Selecione...'
    $empty_option.disabled = true
    $empty_option.selected = Boolean($select.value === '' || ($select.value !== '' && !data.length))
    $select.innerHTML = ''
    $select.appendChild($empty_option)

    data.forEach(item => {
        const $option = document.createElement('option')
        $option.value = item
        $option.innerText = item
        $select.appendChild($option)
    })
}

const selectDocumentToLPCO = (e, documentsState) => {
    const documentType = e.target.getAttribute('data-document-type')
    const $select = document.querySelector(`[data-document-type="${documentType}"][data-select]`)
    const documentToLPCO = $select.value

    documentsState[`${documentType}SelectedToLPCO`] = documentToLPCO || null
}

export const loadDocumentos = (frameDiv, currentState) => runWithLoading(() => {
    frameLoad(null, 'pages/frames/1-documentos/documentos.html', frameDiv, () => {
        currentState.DOCUMENTOS = {
            dueIsSelected: true,
            cctIsSelected: true,
            dueSelectedToLPCO: null,
            cctSelectedToLPCO: null,
            due: [],
            cct: [],
        }

        const documentsState = currentState.DOCUMENTOS
        const $change_form_disable_radios = document.querySelectorAll('[data-event="change-form-disable"]')
        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')
        const $add_document_buttons = document.querySelectorAll('[data-event="add-document"]')
        const $choose_document = document.querySelectorAll('[data-event="select-document"]')

        $change_form_disable_radios.forEach(el => el.addEventListener('change', (e) => formDisablePubSub.notify(e, documentsState)))
        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
        $add_document_buttons.forEach(el => el.addEventListener('click', (e) => onAddItem(e, documentsState)))
        $choose_document.forEach(el => el.addEventListener('change', (e) => selectDocumentToLPCO(e, documentsState)))
        
        // Subscrição para quando os campos "deseja usar DUE" e "deseja usar CCT" forem alterados, os formulários que serão exibidos também serão
        formDisablePubSub.subscribe(changeFormDisable)
        // Subscrição para quando o estado for alterado, o estado atualizado será renderizado na tabela
        renderTablePubSub.subscribe((documentType, data) => {
            const $table = document.querySelector(`table[data-document-type="${documentType}"]`)
            
            renderTable(data, $table, (index) => onRemoveItem(index, documentsState, documentType))
        })
        // Subscrição para quando documentos forem adicionados na tabela, o select correspondente seja atualizado
        renderTablePubSub.subscribe(renderSelectOptions)
        // Subscrição para quando documentos forem removidos da tabela, caso o select correspondente tenha selecionado um desses documentos removidos, ele irá atualizar o valor
        renderTablePubSub.subscribe(() => $choose_document.forEach(el => selectDocumentToLPCO({ target: el }, documentsState)))


    })
}, 'Carregando aba "Documentos"...')