import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadSolicitacoes = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/5-solicitacoes/solicitacoes.html', frameDiv, () => {
        //TODO implementar comportamento (Solicitações)
    })
}, 'Carregando aba "Solicitações"...')