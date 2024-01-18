import {useEffect} from "react"
import {getCurrentScrollHistory, HistoryState, ScrollPos, setCurrentScrollHistory} from "./storage"
import usePageHref from "./usePageHref"


const getWindowScroll = (): ScrollPos => [window.scrollX, window.scrollY]

const restoreScroll = ([left, top]: ScrollPos) => {
    console.log(`Scroll restored to ${left} ${top}.`)
    window.scroll({
        behavior: 'instant',
        left,
        top
    })
}

const rememberScroll = () => {
    const scroll = getWindowScroll()
    setCurrentScrollHistory(scroll)
}
const mountScroll = () => {
    console.log('Scroll listener mounted.')
    window.addEventListener('scroll', rememberScroll)
}
const unmountScroll = () => {
    console.log('Scroll listener unmounted.')
    window.removeEventListener('scroll', rememberScroll)

}
const popstate = (e: PopStateEvent) => {
    console.log('Popstate started.')
    const scroll = getCurrentScrollHistory(e.state as HistoryState)
    console.log(`Found scroll ${scroll?.toString()}.`)
    if (scroll) {
        restoreScroll(scroll)
    }
}
const unmountPop = () => {
    console.log('Unmount popstate.')

    window.removeEventListener('popstate', popstate)
}
const mountPop = () => {
    console.log('Mount popstate.')

    window.addEventListener('popstate', popstate)
}
const useScrollRestorer = (): void => {
    useEffect(() => {
        const scroll = getCurrentScrollHistory(window.history.state as HistoryState)
        if (scroll) {
            restoreScroll(scroll)
        }
        window.history.scrollRestoration = 'manual'
        mountPop()
        mountScroll()
        return () => {
            unmountPop()
            unmountScroll()
        }
    }, [])
}
export default useScrollRestorer
