import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadDadosGerais = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/2-dados-gerais/dados-gerais.html', frameDiv, () => {
        //TODO implementar comportamento (Dados Gerais)
    })
}, 'Carregando aba "Dados Gerais"...')