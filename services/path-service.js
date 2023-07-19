export const getPath = () => window.location.pathname
export const setPath = path => window.history.pushState({}, document.title, `${window.location.origin}${path}`)