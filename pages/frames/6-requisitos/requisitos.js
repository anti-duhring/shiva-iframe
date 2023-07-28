import { collapseForm } from '../../../services/collapse-form-service'
import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadRequisitos = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/6-requisitos/requisitos.html', frameDiv, () => {
        const $collapse_buttons = document.querySelectorAll('.form-session-collapse')

        $collapse_buttons.forEach(el => el.addEventListener('click', collapseForm))
    })
}, 'Carregando aba "Requisitos"...')