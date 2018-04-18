import React from 'react'
import Banners from "./Banners"
import { inject, observer } from "mobx-react"
import FeaturedMovies from '../topmovies/FeaturedMovies'
import TopMovies from '../topmovies/TopMovies'

@inject("session")
@observer
class Main extends React.Component {

  componentDidMount() {
    document.title = "ودیو مرجع فیلم مستقل"
  }

  render() {
    var components = [];
    this.props.main.data.bundles.forEach((bundle, l) => {
      if (bundle.type == 2) {
        components.push(
          <TopMovies
            analyticsId={bundle.id}
            analyticsLabel="movieList"
            analyticsAction="click"
            analyticsCategory="Home"
            margin={10}
            key={l}
            movies={bundle.movies}
            id={bundle.id}
            title={bundle.title}
            elementId={bundle.id}
          />
        );
      } else if (bundle.type == 3) {
        components.push(
          <FeaturedMovies
            analyticsId={bundle.id}
            analyticsLabel="featuredList"
            analyticsAction="click"
            analyticsCategory="Home"
            margin={0}
            key={l}
            movies={bundle.movies}
            id={bundle.id}
            title={bundle.title}
          />
        );
      } else if (bundle.type == 1) {
        components.push(<Banners key={l} bundle={bundle} isServer={this.props.isServer} />);
      }
    });

    return <div>{components}</div>;
  }
}

export default Main