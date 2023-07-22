/**
 * Função que renderiza a tabela de forma dinâmica
 * @param {Array<Array<string>>} data - Todos os dados que serão renderizados na tabela. Cada tr deve ser um elemento da array "data", e cada td será um elemento dentro dessa array
 * @param {HTMLTableElement} table - Elemento da tabela que será renderizada
 * @param {Function} removeItemFn - Função que será executada quando o usuário clicar no botão de remoção de um item da tabela
 * @returns 
 */
export const renderTable = (data, table, removeItemFn) => {
    const $table_body = table.querySelector('tbody')
    const newTrs = []

    if(!data.length) {
        const colspan = table.querySelector('thead').rows[0].cells.length
        $table_body.innerHTML = ''
        $table_body.appendChild(generateEmptyTr(colspan))
        
        return
    }

    data.forEach((data, index) => {
        const tr = generateTr(data, () => removeItemFn(index))

        newTrs.push(tr)
    })

    $table_body.innerHTML = ''
    newTrs.forEach(tr => $table_body.appendChild(tr))
}

function generateEmptyTr(colspan) {
    const $empty_tr = document.createElement('tr')
    const $empty_td = document.createElement('td')
    const $td_action_buttons = document.createElement('td')

    $empty_td.textContent = 'Nenhum item cadastrado'
    $empty_td.colSpan = colspan - 1
    $td_action_buttons.classList.add('table-action-cell')
    $empty_tr.classList.add('form-table-empty-tr')

    $empty_tr.appendChild($empty_td)
    $empty_tr.appendChild($td_action_buttons)
    
    return $empty_tr
}

function generateTr(data, removeFunction) {
    const $tr = document.createElement('tr')
    

    data.forEach(content => {
        const $td = document.createElement('td')
        $td.textContent = content
        $tr.appendChild($td)
    })

    const $td_action_buttons = document.createElement('td')
    const $delete_action_button = document.createElement('button')

    $delete_action_button.classList.add('table-action-button')
    $delete_action_button.innerHTML = `<svg viewBox="0 0 24 24" width="20" height="20" xmlns="http://www.w3.org/2000/svg"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"></path></svg>`
    $td_action_buttons.classList.add('table-action-cell')
    $td_action_buttons.appendChild($delete_action_button)

    $delete_action_button.addEventListener('click', removeFunction)

    $tr.appendChild($td_action_buttons)

    return $tr
}