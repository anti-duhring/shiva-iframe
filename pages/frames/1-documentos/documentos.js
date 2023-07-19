import { runWithLoading } from '../../../services/loading-service'
import { frameLoad } from '../../../services/requests-service'

export const loadDocumentos = frameDiv => runWithLoading(() => {
    frameLoad(null, 'pages/frames/1-documentos/documentos.html', frameDiv, () => {
        //TODO implementar comportamento (Documentos)
    })
}, 'Carregando aba "Documentos"...')