import { kea } from 'kea'

export const currentPageLogic = kea({
    actions: () => ({
        setHref: (href) => ({ href }),
    }),

    reducers: () => ({
        href: [window.location.href, { setHref: (_, { href }) => href }],
    }),

    events: ({ actions, cache, values }) => ({
        afterMount: () => {
            cache.interval = window.setInterval(() => {
                if (window.location.href !== values.href) {
                    actions.setHref(window.location.href)
                }
            }, 500)
            cache.location = () => {
                window.requestAnimationFrame(() => {
                    actions.setHref(window.location.href)
                })
            }
            window.addEventListener('popstate', cache.location)
        },
        beforeUnmount: () => {
            window.clearInterval(cache.interval)
            window.removeEventListener('popstate', cache.location)
        },
    }),
})
