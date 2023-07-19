import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadConteineres = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/4-conteineres/conteineres.html', frameDiv, () => {
        //TODO implementar comportamento (Conteineres)
    })
}, 'Carregando aba "Conteineres"...')