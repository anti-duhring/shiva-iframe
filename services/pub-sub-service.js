export const factoryPubSub = () => {
    const subscribers = new Map();

    const subscribe = (callback, name) => {
        const id = Symbol.for(name)

        if(!subscribers.has(id)) {
            subscribers.set(id, callback)
        }
    }

    const unsubscribe = (name) => {
        const id = Symbol.for(name)

        subscribers.delete(id)
    }

    const notify = (...args) => {
        subscribers.forEach(callback => callback(...args))
    }
    
    return {
        subscribe,
        unsubscribe,
        notify
    }
}
