import React from "react"
import { MainUrl } from "../../util/RequestHandler"
import Link from 'next/link'
import { inject, observer } from "mobx-react"
import Slider from 'react-slick'
import '../../css/style.css'

let dragging = false

@inject("session")
@observer
export default class Banners extends React.Component {
  constructor() {
    super()
    this.state = { width: 0 }
  }
  makeUrl(category, genre) {
    var url = MainUrl + "/movielist.ashx"
    if (category != null || genre != null) {
      url = url + "?"
    }
    if (category != null) {
      url = url + "categoryId=" + category
    }
    if (genre != null) {
      url = url + "genreId=" + genre
    }
    return url
  }

  listClick(genreId, categoryId, title, bannerId) {
    if (!dragging) {
      var cId = 0
      var gId = 0
      if (categoryId != null) {
        cId = categoryId + 1
      }
      if (genreId != null) {
        gId = genreId + 1
      }
      this.props.session.gaUrl = "/list/" + cId + "/" + gId
      this.props.session.offset = 0
      var url = this.makeUrl(categoryId, genreId)
      this.props.session.listUrl = url
      this.props.session.isInitiating = true
      this.props.session.title = title
      this.props.session.fetchList()
    }
  }

  movieClicked(movieId, bannerId) {
  }

  componentDidMount() {
    var width = window.screen.availWidth * window.devicePixelRatio
    this.setState({ width: width })
  }

  beforeChange() {
    dragging = true
  }

  afterChange() {
    dragging = false
  }

  render() {
    var components = []
    this.props.bundle.banners.forEach((banner, l) => {
      if (banner.urlToClick != null) {
        components.push(
          <a
            key={l}
            style={{ cursor: "pointer", position: "relative" }}
            onClick={e => {
              if (!dragging) {
              } else {
                e.preventDefault()
              }
            }}
            href={banner.urlToClick}
          >
            {this.state.width != 0 &&
              <img
                style={{ width: "100%", pointerEvents: "none" }}
                src={
                  MainUrl + "/image.ashx?file=" + banner.url + "&width=" + this.state.width
                }
              />}
          </a>
        )
      } else if (banner.movieId != null && banner.movieId > 0) {
        components.push(
          <a
            key={l}
            onClick={e => {
              if (!dragging) {
              } else { e.preventDefault() }
            }}
            style={{ position: "relative", width: "100%", cursor: "pointer" }}
          >
            <div>
              {this.state.width != 0 && <img
                style={{ width: "100%", pointerEvents: "none" }}
                src={
                  MainUrl + "/image.ashx?file=" + banner.url + "&width=" + this.state.width
                }
              />}
              <div style={{ pointerEvents: "none", position: "absolute", top: "0", right: "0", bottom: "0", left: "0", zIndex: "2" }}></div>

              <div className="banner-text-container" style={{ pointerEvents: "none" }}>
                <div className="banner-container-description">{banner.description}</div>
              </div>
            </div>
          </a>
        )
      } else if (banner.genreId != null || banner.categoryId != null) {
        components.push(
          <Link
            style={{ cursor: "pointer" }}
            key={l}
            onClick={this.listClick.bind(
              this,
              banner.genreId,
              banner.categoryId,
              banner.listName,
              banner.id
            )}
            href={{ pathname: "/List" }}
          ><img
              style={{ width: "100%" }}
              src={
                MainUrl + "/image.ashx?file=" + banner.url + "&width=" + this.state.width
              }
            />
          </Link>
        )
      }
    })

    var dots = true
    const settings = {
      dots: dots,
      infinite: true,
      slidesToShow: 1,
      slidesToScroll: 1,
      arrows: false,
      autoplay: this.props.isServer,
      autoplaySpeed: 3000,
      rtl: false,
      afterChange: this.afterChange.bind(this),
      beforeChange: this.beforeChange.bind(this),
    }

    return (
      <Slider className="max-width-banner" {...settings}>
        {components}
      </Slider>
    )
  }
}
