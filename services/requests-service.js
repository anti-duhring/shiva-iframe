export const frameLoad = (onBefore, path, containerElement, onAfter) => {
    let next = true
    if (onBefore) {
        next = onBefore()
    }
    if (next) {
        fetch(path)
        .then(response => response.text())
        .then(text => {
            containerElement.innerHTML = text
            if (onAfter) {
                onAfter()
            }
        })
    }
}