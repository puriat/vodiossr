import React from 'react'
import { Provider } from 'mobx-react'
import { initSessionStore } from '../store/sessionStore'
import { initSearchStore } from '../store/searchStore'
import { initMovieStore } from '../store/movieStore'

import Rules from '../components/rule/Rules'
import fetch from 'isomorphic-unfetch'
import { MainUrl } from "../util/RequestHandler"
import Layout from '../components/Layout'

export default class rules extends React.Component {

  static async getInitialProps({ req }) {
    const isServer = !!req

    const sessionStore = initSessionStore(isServer)
    const searchStore = initSearchStore(isServer)
    const movieStore = initMovieStore(isServer)

    return {
      searchStore: searchStore.toJson(),
      sessionStore: sessionStore.toJson(),
      movieStore:movieStore.toJson(),
      isServer
    }
  }

  constructor(props) {
    super(props)
    this.movieStore = initMovieStore(props.isServer,props.movieStore)
    this.sessionStore = initSessionStore(props.isServer,props.sessionStore)
    this.searchStore = initSearchStore(props.isServer,props.searchStore)
  }

  render() {
    const store = {
      session: this.sessionStore,
      search: this.searchStore,
      movieStore: this.movieStore
    }
    return (
      <Provider {...store}>
        <Layout><Rules /></Layout>
      </Provider>
    )
  }
}
