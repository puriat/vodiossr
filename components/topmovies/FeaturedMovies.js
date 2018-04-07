import React, { Component } from "react"
import FeaturedMovie from "./FeaturedMovie"
import Slider from 'react-slick'
import $ from 'jquery';
import "slick-carousel/slick/slick.css"
import "slick-carousel/slick/slick-theme.css"

export default class FeaturedMovies extends React.Component {
    nextClicked() {
        this.slider.slickNext()
    }

    prevClicked() {
        this.slider.slickPrev()
    }


    componentDidMount() {
        var width = window.innerWidth
        if (width < 750) {
            $(".slide-next-container").css("display", "none")
            $(".slide-prev-container").css("display", "none")
        }
    }

    render() {
        var margin = this.props.margin ? this.props.margin + "px" : "0px"

        const settings = {
            dots: false,
            slidesToShow: 5,
            slidesToScroll: 5,
            arrows: false,
            rtl: false,
            infinite: false,
            responsive: [{
                breakpoint: 1300,
                settings: {
                    slidesToShow: 4,
                    slidesToScroll: 4,
                }
            }, {
                breakpoint: 1000,
                settings: {
                    slidesToShow: 3,
                    slidesToScroll: 3,
                }
            }]
        }


        return (
            <div className="slide-overlay" style={{ marginRight: margin, marginLeft: margin, width: "100%" }}>
                <div className="featured-container">
                    <div className="featured-title-container">
                        <img src='/static/movieListFeatured.svg' style={{
                            width: '15px',
                            position: 'absolute',
                            right: '12.5%',
                            top: '13px'
                        }} />
                        <h5 className="featured-container-title-h">{this.props.title}</h5>
                    </div>
                    <div className="slide-next-container-featured">
                        <div className="slide-next-featured" onClick={this.nextClicked.bind(this)} />
                    </div>
                    <Slider ref={c => this.slider = c} {...settings} className="featured-slider">
                        {this.props.movies.map((movie, l) => (
                            <FeaturedMovie
                                analyticsId={this.props.analyticsId}
                                analyticsLabel={this.props.analyticsLabel}
                                analyticsAction={this.props.analyticsAction}
                                analyticsCategory={this.props.analyticsCategory}
                                key={movie.id}
                                movie={movie}
                                elementId={movie.id + l}
                            />
                        ))}
                    </Slider>

                    <div className="slide-prev-container-featured">
                        <div className="slide-prev-featured" onClick={this.prevClicked.bind(this)} />
                    </div>
                </div>
            </div >
        )
    }
}
