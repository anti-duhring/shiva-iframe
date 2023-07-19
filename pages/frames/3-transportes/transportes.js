import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadTransportes = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/3-transportes/transportes.html', frameDiv, () => {
        //TODO implementar comportamento (Transportes)
    })
}, 'Carregando aba "Transportes"...')