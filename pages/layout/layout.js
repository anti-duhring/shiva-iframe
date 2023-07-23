import { runWithLoading } from '../../services/loading-service'
import { frameLoad } from '../../services/requests-service'
import { getPath, setPath } from '../../services/path-service'

import { loadDocumentos } from '../frames/1-documentos/documentos'
import { loadDadosGerais } from '../frames/2-dados-gerais/dados-gerais'
import { loadTransportes } from '../frames/3-transportes/transportes'
import { loadConteineres } from '../frames/4-conteineres/conteineres'
import { loadSolicitacoes } from '../frames/5-solicitacoes/solicitacoes'
import { loadRequisitos } from '../frames/6-requisitos/requisitos'

export const loadLayout = () => runWithLoading(() => {
    frameLoad(null, 'pages/layout/layout.html', document.getElementById('app'), () => {
        const currentState = {
            DOCUMENTOS: {},
            DADOSGERAIS: {},
            TRANSPORTES: {},
            CONTEINERES: {},
        }

        const frames = {
            DOCUMENTOS: { index: 0, el: document.getElementById('documentos'), fn: loadDocumentos, path: '/documentos' },
            DADOSGERAIS: { index: 1, el: document.getElementById('dados-gerais'), fn: loadDadosGerais, path: '/dados-gerais' },
            TRANSPORTES: { index: 2, el: document.getElementById('transportes'), fn: loadTransportes, path: '/transportes' },
            CONTEINERES: { index: 3, el: document.getElementById('conteineres'), fn: loadConteineres, path: '/conteineres' },
            SOLICITACOES: { index: 4, el: document.getElementById('solicitacoes'), fn: loadSolicitacoes, path: '/solicitacoes' },
            REQUISITOS: { index: 5, el: document.getElementById('requisitos'), fn: loadRequisitos, path: '/requisitos' },
        }

        frames.DOCUMENTOS.el.addEventListener('click', () => tabSelect(frames.DOCUMENTOS))
        frames.DADOSGERAIS.el.addEventListener('click', () => tabSelect(frames.DADOSGERAIS))
        frames.TRANSPORTES.el.addEventListener('click', () => tabSelect(frames.TRANSPORTES))
        frames.CONTEINERES.el.addEventListener('click', () => tabSelect(frames.CONTEINERES))
        frames.SOLICITACOES.el.addEventListener('click', () => tabSelect(frames.SOLICITACOES))
        frames.REQUISITOS.el.addEventListener('click', () => tabSelect(frames.REQUISITOS))

        const tabs = document.getElementById('header').children;
        const voltar = document.getElementById('voltar')
        const proximo = document.getElementById('proximo')

        const tabSelect = frame => {
            frame.fn(document.getElementById('frame'), currentState)
            for (const tab of tabs) {
                if (tab === frame.el) {
                    tab.classList.add('active')
                } else {
                    tab.classList.remove('active')
                }
            }
            if (frame.index < 1) {
                voltar.disabled = 'disabled'
            } else {
                voltar.disabled = ''
            }
            if (frame.index < 5) {
                proximo.innerText = 'Salvar e avançar'
            } else {
                proximo.innerText = 'Finalizar'
            }
            setPath(frame.path)
        }

        const getFrameFromPath = path => {
            if (path == frames.DOCUMENTOS.path) {
                return frames.DOCUMENTOS
            } else if (path == frames.DADOSGERAIS.path) {
                return frames.DADOSGERAIS
            } else if (path == frames.TRANSPORTES.path) {
                return frames.TRANSPORTES
            } else if (path == frames.CONTEINERES.path) {
                return frames.CONTEINERES
            } else if (path == frames.SOLICITACOES.path) {
                return frames.SOLICITACOES
            } else if (path == frames.REQUISITOS.path) {
                return frames.REQUISITOS
            }
            return null
        } 

        const currentPath = getPath()
        if (currentPath != '/') {
            tabSelect(getFrameFromPath(currentPath))
        } else {
            tabSelect(frames.DOCUMENTOS)
        }
        
        const getTabSelectedIndex = () => {
            for (const tab of tabs) {
                if (tab.classList.contains('active')) {
                    if (tab == frames.DOCUMENTOS.el) {
                        return frames.DOCUMENTOS.index
                    } else if (tab == frames.DADOSGERAIS.el) {
                        return frames.DADOSGERAIS.index
                    } else if (tab == frames.TRANSPORTES.el) {
                        return frames.TRANSPORTES.index
                    } else if (tab == frames.CONTEINERES.el) {
                        return frames.CONTEINERES.index
                    } else if (tab == frames.SOLICITACOES.el) {
                        return frames.SOLICITACOES.index
                    } else if (tab == frames.REQUISITOS.el) {
                        return frames.REQUISITOS.index
                    }
                }
            }
            return 0
        }

        const getFrameFromIndex = index => {
            if (index == frames.DOCUMENTOS.index) {
                return frames.DOCUMENTOS
            } else if (index == frames.DADOSGERAIS.index) {
                return frames.DADOSGERAIS
            } else if (index == frames.TRANSPORTES.index) {
                return frames.TRANSPORTES
            } else if (index == frames.CONTEINERES.index) {
                return frames.CONTEINERES
            } else if (index == frames.SOLICITACOES.index) {
                return frames.SOLICITACOES
            } else if (index == frames.REQUISITOS.index) {
                return frames.REQUISITOS
            }
            return null
        }        

        voltar.addEventListener('click', () => {
            const currentIndex = getTabSelectedIndex()
            if (currentIndex > 0) {
                tabSelect(getFrameFromIndex(currentIndex - 1))
            }
        })

        proximo.addEventListener('click', () => {
            const currentIndex = getTabSelectedIndex()
            if (currentIndex < 5) {
                tabSelect(getFrameFromIndex(currentIndex + 1))
            } else {
                //TODO implementar "finalização"
            }
        })

    })
}, 'Carregando layout...')