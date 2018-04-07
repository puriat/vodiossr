import React from 'react'
import { Provider } from 'mobx-react'
import { initSessionStore } from '../store/sessionStore'
import { initSearchStore } from '../store/searchStore'
import { initMovieStore } from '../store/movieStore'

import List from '../components/list/List'
import fetch from 'isomorphic-unfetch'
import { MainUrl } from "../util/RequestHandler"
import Layout from '../components/Layout'

export default class list extends React.Component {

    static async getInitialProps({ req, query }) {
        const isServer = !!req

        var categoryId = -1;
        var genreId = -1;

        if (req == undefined) {
            categoryId = query.categoryId
            genreId = query.genreId
        } else {
            categoryId = req.params.categoryId
            genreId = req.params.genreId
        }
        var url = "/movieList.ashx?";
        if (categoryId != 0) {
            categoryId--
            url = url + "categoryId=" + categoryId
        }
        if (categoryId == 0 && genreId != 0) {
            genreId--
            url = url + "genreId=" + genreId
        }
        if (categoryId != 0 && genreId != 0) {
            genreId--
            url = url + "&genreId=" + genreId
        }
        var listUrl = MainUrl + url
        url = url + "&offset=0&size=20"

        var res = await fetch(MainUrl + url);
        var list = await res.json();

        const sessionStore = initSessionStore(isServer)
        const searchStore = initSearchStore(isServer)
        const movieStore = initMovieStore(isServer)
        sessionStore.fetchList(list.data, list.count)
        sessionStore.listUrl = listUrl;

        if (sessionStore.categories == null) {
            var resCat = await fetch(MainUrl + "/category.ashx")
            var cats = await resCat.json();

            cats.data.forEach(category => {
                if (category.id == categoryId) {
                    sessionStore.title = category.name;
                    category.genres.forEach(genre => {
                        if (genre.id == genreId) {
                            sessionStore.title += " - " + genre.name;
                        }
                    });
                }
            });
        }

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
                <Layout><List /></Layout>
            </Provider>
        )
    }
}
