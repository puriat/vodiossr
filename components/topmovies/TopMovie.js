import React, { Component } from "react"
import Link from 'next/link'
import { latinToPersian, convertSecondToString } from "../../util/util"
import { MainUrl } from "../../util/RequestHandler"
import { inject, observer } from "mobx-react"
import createReactClass from 'create-react-class'
import $ from 'jquery';

var flag = 0;

@inject("session")
@observer
export default class TopMovie extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      durationString: "",
      director: null,
      researcher: null,
      provider: null,
      actors: null,
      width: 0,
      height: 0
    }
  }

  componentDidMount() {
    this.setState({
      durationString: convertSecondToString(this.props.movie.duration)
    })
    var directorTemp
    var ActorTemp
    var providerTemp
    var ResearcherTemp
    if (this.props.movie.role != undefined) {
      $.each(this.props.movie, function (index, role) {
        if (role.name == "کارگردان") {
          directorTemp = role
        } else if (role.name == "بازیگر") {
          ActorTemp = role
        } else if (role.name == "تهیه کننده") {
          providerTemp = role
        } else if (role.name == "پژوهشگر") {
          ResearcherTemp = role
        }
      })
      this.setState({
        director: directorTemp,
        researcher: ResearcherTemp,
        provider: providerTemp,
        actors: ActorTemp
      })
    }

    var windowWidth = window.innerWidth
    var width = 0
    if (windowWidth > 1400) {
      width = Math.round(windowWidth / 8)
    } else if (windowWidth > 1200) {
      width = Math.round(windowWidth / 7)
    } else if (windowWidth > 1000) {
      width = Math.round(windowWidth / 6)
    } else if (windowWidth > 600) {
      width = Math.round(windowWidth / 5)
    } else {
      width = Math.round(windowWidth / 4)
    }
    width = Math.round(width * window.devicePixelRatio)
    var height = Math.round(width * 16 / 11)
    this.setState({ width: width, height: height })

    var width = window.innerWidth
    if (width > 750) {
      $(".top-moviez-inner" + this.props.elementId).hover(
        function () {
          $(".top-moviez-post-overlay" + this.props.elementId).css(
            "visibility",
            "visible"
          )
          $(".top-moviez-post-overlay" + this.props.elementId).css(
            "opacity",
            "1"
          )
          $(".top-moviez-post-title" + this.props.elementId).css(
            "top",
            "calc(45% - 20px)"
          )
          $(".top-moviez-post-director" + this.props.elementId).css(
            "top",
            "calc(50% - 20px)"
          )
        }.bind(this),
        function () {
          $(".top-moviez-post-overlay" + this.props.elementId).css(
            "opacity",
            "0"
          )
          $(".top-moviez-post-overlay" + this.props.elementId).css(
            "visibility",
            "hidden"
          )
          $(".top-moviez-post-title" + this.props.elementId).css(
            "top",
            "calc(60% - 20px)"
          )
          $(".top-moviez-post-director" + this.props.elementId).css(
            "top",
            "calc(75% - 20px)"
          )
        }.bind(this)
      )
    }

    flag = 0
    var x = 0;
    var y = 0;
    $("#div" + this.props.elementId).on('click auxclick contextmenu mousedown mouseup', function (e) {
      e.preventDefault();

      if (e.type == "contextmenu") {
        return;
      }
      if (e.type == "mousedown") {
        flag = 0;
        x = e.pageX
        y = e.pageY
      } else if (e.type == "mouseup") {
        switch (e.which) {
          case 1:
            if (e.ctrlKey) {
              var win = window;
              window.open("/movie", '_blank');
              win.focus();

            } else {
              var d = Math.sqrt(Math.pow(e.pageX - x, 2) + Math.pow(e.pageY - y, 2));
              if (d < 4) {
                e.stopPropagation();
              }
            }
            break;
          case 2:
            return;
            break;
          case 3:
            break;
        }
      }
    }.bind(this));
  }

  movieClicked(movieId) {
  }

  render() {
    var style = {
      width: "100%",
      height: "100%",
      position: "absolute",
      zIndex: "2",
      opacity: "0",
      transition: "visibility 0.5s, opacity 0.5s linear",
      visibility: "hidden",
      background: "white"
    }

    var titleStyle = {
      position: "relative",
      top: "calc(60% - 20px)",
      color: "black",
      height: "40px",
      width: "100%",
      textAlign: "center",
      fontSize: "20px",
      transition: "top 0.3s linear",
      fontFamily: "IRSansBold",
      lineHeight: "1"
    }

    var directorStyle = {
      position: "relative",
      top: "calc(75% - 20px)",
      color: "black",
      height: "40px",
      width: "100%",
      textAlign: "center",
      fontSize: "14px",
      transition: "top 0.3s linear"
    }

    return (
      <div id={"div" + this.props.elementId} className={"top-moviez-inner" + this.props.elementId} >
        <Link as={`/movie/${this.props.movie.id}`} href={`/movie?id=${this.props.movie.id}`} shallow>
          <div id={this.props.elementId} style={{ cursor: "pointer", position: "relative" }}>
            <div
              className={"top-moviez-post-overlay" + this.props.elementId}
              style={style}
            >
              <div
                className={"top-moviez-post-title" + this.props.elementId}
                style={titleStyle}
              >
                {latinToPersian(this.props.movie.title)}
              </div>
              {this.props.movie.directors && (
                <div
                  className={"top-moviez-post-director" + this.props.elementId}
                  style={directorStyle}
                >
                  {this.props.movie.directors[0].name}
                </div>
              )}
            </div>
            {this.state.width != 0 && <img
              src={
                MainUrl +
                "/image.ashx?file=" +
                this.props.movie.thumbnail.url +
                "&height=" +
                this.state.height +
                "&width=" +
                this.state.width
              }
              className="top-moviez-post-image"
            />}
          </div>
        </Link>
      </div>
    )
  }
}

function makeid() {
  var text = ""
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789"

  for (var i = 0; i < 5; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length))

  return text
}

var Genre = createReactClass({
  render() {
    return (
      <div>
        <strong className="inline-class">ژانر : </strong>
        {this.props.genres.map((genre, l) => (
          <div className="inline-class" key={genre.id}>
            {genre.name}
            {this.props.genres.length - 1 != l ? (
              <p className="inline-class"> , </p>
            ) : null}
          </div>
        ))}
      </div>
    )
  }
})

var Director = createReactClass({
  render() {
    return (
      <div>
        <strong className="inline-class">کارگردان : </strong>
        {this.props.directors.agents.map((director, l) => (
          <div className="inline-class" key={director.id}>
            <Link
              className="inline-class"
              to={{ pathname: "/agent/" + director.id }}
            >
              {director.name}
            </Link>
            {this.props.directors.agents.length - 1 != l ? (
              <p className="inline-class"> , </p>
            ) : null}
          </div>
        ))}
      </div>
    )
  }
})
