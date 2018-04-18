import React, { Component } from "react";
import TopMovie from "./TopMovie";
import $ from 'jquery';
import Slider from 'react-slick'
import slickSS from "styles/slick.css"
import slickThemeSS from "styles/slick-theme.css"


export default class TopMovies extends React.Component {
  nextClicked() {
    this.slider.slickNext();
  }

  prevClicked() {
    this.slider.slickPrev();
  }


  componentDidMount() {
    var width = window.innerWidth
    if (width < 750) {
      $(".slide-next-container").css("display", "none");
      $(".slide-prev-container").css("display", "none");
    }
  }

  render() {
    const settings = {
      dots: false,
      slidesToShow: 8,
      slidesToScroll: 8,
      arrows: false,
      rtl: false,
      responsive: [{
        breakpoint: 1400,
        settings: {
          slidesToShow: 7,
          slidesToScroll: 7,
        }
      }, {
        breakpoint: 1200,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 6,
        }
      }, {
        breakpoint: 1000,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 5,
        }
      }, {
        breakpoint: 600,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
        }
      }]
    }
    var margin = this.props.margin ? this.props.margin + "px" : "0px"

    return (
      <div className="slide-overlay" style={{ marginRight: margin, marginLeft: margin }}>
        <style dangerouslySetInnerHTML={{ __html: slickSS }} />
        <style dangerouslySetInnerHTML={{ __html: slickThemeSS }} />
        <div style={{
          position: 'relative',
          height: '30px',
          display: 'inline-flex',
          width: '100%'
        }}>
          <img src='/static/img/movieList.svg' style={{
            width: '15px',
            position: 'absolute',
            right: '5px',
            top: '13px'
          }} />
          <h5 className="top-moviez-slide-title">{this.props.title}</h5>
        </div>
        <div className="slide-next-container">
          <div className="slide-next" onClick={this.nextClicked.bind(this)} />
        </div>
        <Slider ref={c => this.slider = c} className="max-width-banner" {...settings} style={{ display: 'flex' }}>
          {this.props.movies.map((movie, l) => (
            <TopMovie
              analyticsId={this.props.analyticsId}
              analyticsLabel={this.props.analyticsLabel}
              analyticsAction={this.props.analyticsAction}
              analyticsCategory={this.props.analyticsCategory}
              key={movie.id}
              movie={movie}
              elementId={movie.id + this.props.elementId}
            />
          ))}
        </Slider>
        <div className="slide-prev-container">
          <div className="slide-prev" onClick={this.prevClicked.bind(this)} />
        </div>
      </div>
    );
  }
}
