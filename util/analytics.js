import ReactGA from 'react-ga'

export const initGA = () => {
  ReactGA.initialize('UA-115308409-1')
}

export const logPageView = () => {
  ReactGA.set({ page: window.location.pathname })
  ReactGA.pageview(window.location.pathname)
}

export const logEvent = (category = '', label ='',action = '',value='') => {
  if (category && action) {
    ReactGA.event({ category :category, action:action,label:label,value:value })
  }
}

export const logException = (description = '', fatal = false) => {
  if (description) {
    ReactGA.exception({ description, fatal })
  }
}
