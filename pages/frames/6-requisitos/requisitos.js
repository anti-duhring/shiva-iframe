import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadRequisitos = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/6-requisitos/requisitos.html', frameDiv, () => {
        //TODO implementar comportamento (Requisitos)
    })
}, 'Carregando aba "Requisitos"...')