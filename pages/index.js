import React from 'react'
import { Provider } from 'mobx-react'
import { initSessionStore } from '../store/sessionStore'
import { initSearchStore } from '../store/searchStore'
import { initMovieStore } from '../store/movieStore'

import Main from '../components/main/Main'
import fetch from 'isomorphic-unfetch'
import { MainUrl } from "../util/RequestHandler"
import Layout from '../components/Layout'

export default class main extends React.Component {

  static async getInitialProps({ req }) {
    const isServer = !!req

    var res = await fetch(MainUrl + "/home.ashx");
    var main = await res.json();

    const sessionStore = initSessionStore(isServer)
    const searchStore = initSearchStore(isServer)
    const movieStore = initMovieStore(isServer)

    return {
      searchStore: searchStore.toJson(),
      sessionStore: sessionStore.toJson(),
      movieStore:movieStore.toJson(),
      isServer,
      main: main
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
        <Layout><Main main={this.props.main} isServer={this.props.isServer} /></Layout>
      </Provider>
    )
  }
}
