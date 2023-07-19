export const runWithLoading = async (fn, desc) => {
    const appElement = document.getElementById('app')
    appElement.style.display = 'none'
    const loadingElement = document.getElementById('loading')
    const loadindDescElement = document.getElementById('loadingDesc')
    if (desc) {
        loadindDescElement.innerHTML = desc
        loadindDescElement.style.display = ''
    } else {
        loadindDescElement.style.display = 'none'
    }
    loadingElement.style.display = 'flex'
    setTimeout(() => {
        try {
            fn()
        } finally {
            loadingElement.style.display = 'none'
            appElement.style.display = 'flex'
        }        
    }, 2000)
}