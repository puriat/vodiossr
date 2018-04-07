import React from 'react'
import { Provider } from 'mobx-react'
import { initSessionStore } from '../store/sessionStore'
import { initSearchStore } from '../store/searchStore'
import { initMovieStore } from '../store/movieStore'

import SearchList from '../components/search/SearchList'
import fetch from 'isomorphic-unfetch'
import { MainUrl } from "../util/RequestHandler"
import Layout from '../components/Layout'

export default class search extends React.Component {

    static async getInitialProps({ req, query }) {
        const isServer = !!req
        var keyword = "";
        if (req == undefined)
            keyword = query.keyword
        else {
            keyword = req.params.keyword
        }
        var res = await fetch(MainUrl + "/advanceSearch.ashx?keyword=" + keyword + "&size=20&filter=فیلم");
        var sea = await res.json();

        const sessionStore = initSessionStore(isServer)
        const searchStore = initSearchStore(isServer)
        const movieStore = initMovieStore(isServer)
        searchStore.fetchASearchList(keyword, sea.data == null ? [] : sea.data)

        return {
            searchStore: searchStore.toJson(),
            sessionStore: sessionStore.toJson(),
            movieStore: movieStore.toJson(),
            isServer
        }
    }

    constructor(props) {
        super(props)
        this.movieStore = initMovieStore(props.isServer, props.movieStore)
        this.sessionStore = initSessionStore(props.isServer, props.sessionStore)
        this.searchStore = initSearchStore(props.isServer, props.searchStore)
    }

    render() {
        const store = {
            session: this.sessionStore,
            search: this.searchStore,
            movieStore: this.movieStore
        }
        return (
            <Provider {...store}>
                <Layout><SearchList /></Layout>
            </Provider>
        )
    }
}
