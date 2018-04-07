import React from 'react'
import { Provider } from 'mobx-react'
import { initSessionStore } from '../store/sessionStore'
import { initSearchStore } from '../store/searchStore'
import { initMovieStore } from '../store/movieStore'

import Movie from '../components/movie/Movie'
import fetch from 'isomorphic-unfetch'
import { MainUrl } from "../util/RequestHandler"
import Layout from '../components/Layout'

export default class movie extends React.Component {

    static async getInitialProps({ req, query }) {
        const isServer = !!req
        var id = -1;
        if (req == undefined)
            id = query.id
        else {
            id = req.params.id
        }

        var resMovie = await fetch(MainUrl + "/movie.ashx?movieId=" + id);
        var movie = await resMovie.json();

        var resRole = await fetch(MainUrl + "/role.ashx?movieId=" + id);
        var role = await resRole.json();

        var resRelated = await fetch(MainUrl + "/related.ashx?movieId=" + id);
        var related = await resRelated.json();

        const sessionStore = initSessionStore(isServer)
        const searchStore = initSearchStore(isServer)
        const movieStore = initMovieStore(isServer)
        movieStore.fetchRoles(role.data)
        movieStore.fetchMovie(movie.data)
        movieStore.fetchRelated(related.data)

        return {
            searchStore: searchStore.toJson(),
            sessionStore: sessionStore.toJson(),
            movieStore: movieStore.toJson(),
            isServer
        }
    }

    constructor(props) {
        super(props)
        this.sessionStore = initSessionStore(props.isServer, props.sessionStore)
        this.searchStore = initSearchStore(props.isServer, props.searchStore)
        this.movieStore = initMovieStore(props.isServer, props.movieStore)
    }

    componentDidUpdate(prevProps) {
        if (this.props.url.query.id != prevProps.url.query.id) {
            this.movieStore.movieId = this.props.url.query.id
            this.movieStore.fetchMovie(null);
        }
    }

    render() {
        const store = {
            session: this.sessionStore,
            search: this.searchStore,
            movieStore: this.movieStore
        }
        return (
            <Provider {...store}>
                <Layout><Movie isServer={this.props.isServer} /></Layout>
            </Provider>
        )
    }
}
