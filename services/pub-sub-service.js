export const factoryPubSub = () => {
    const subscribers = new Map();

    const subscribe = (callback) => {
        const id = Symbol.for(callback)

        if(!subscribers.has(id)) {
            subscribers.set(id, callback)
        }
    }

    const unsubscribe = (callback) => {
        const id = Symbol.for(callback)
        
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
