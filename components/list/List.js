import React from "react";
import "../../css/infinite.css";
import Link from 'next/link'
import { inject, observer } from "mobx-react";
import { MainUrl } from "../../util/RequestHandler";
import { latinToPersian, convertSecondToString } from "../../util/util";

@inject("session", "movieStore")
@observer
export default class List extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      class: "first",
      count: 0,
      firstLoad: true,
      offset: 0,
      size: 20,
      width: 0,
      height: 0
    };
  }

  componentDidMount() {
    window.scrollTo(0, 0);
    this.props.session.showFooter = false;
    if (this.props.session.isInitiating == true) {
      this.props.session.isInitiating = false;
    }

    var width = $(".row-header").width();
    if (width > 1400) {
      width = width * 12.5 / 100;
    } else if (width > 1200) {
      width = width * 14.28 / 100;
    } else if (width > 1000) {
      width = width * 16.6 / 100;
    } else if (width > 600) {
      width = width * 25 / 100;
    } else if (width > 400) {
      width = width * 50 / 100;
    }
    width = Math.round(width);
    var height = Math.round(width / 11 * 16);
    this.setState({ width: width, height: height })


    window.onscroll = function () {
      if (!this.props.session.isInitiating) {
        var d = document.documentElement;
        var height = d.scrollTop + $(window).height() - 90;
        var offset = $(".movie-list").innerHeight();
        if (offset < height && !this.state.isLoading && this.props.session.count != this.props.session.offset) {
          this.props.session.isLoading = true;
          this.props.session.fetchList();
        }
      }
    }.bind(this);
  }
  componentWillUnmount() {
    this.props.session.showFooter = true;
  }

  render() {
    var childElements = null;
    if (this.props.session.listElements) {
      childElements = this.props.session.listElements.map(
        function (element, l) {
          return (
            <div className="box movie-list-item" key={l}>
              <Link
                href={"/movie/" + element.id}
              >
                <div className="movie-list-item-link">
                  <span className="movie-list-item-cover">
                    {this.state.width != 0 && this.state.height != 0 && <img
                      className={"movie-list-item-img"}
                      src={
                        MainUrl +
                        "/image.ashx?file=" +
                        element.thumbnail.url +
                        "&width=" +
                        this.state.width +
                        "&height=" +
                        this.state.height
                      }
                    />}
                  </span>
                  <h2 className="movie-list-item-title">
                    <span className="movie-list-item-title-persian">
                      {latinToPersian(element.title)}
                    </span>
                    <span className="movie-list-item-title-english" />
                  </h2>
                </div>
              </Link>
            </div>
          );
        }.bind(this)
      );
    }

    return (
      <div className="movie-list">
        <div className="row-header">
          <img
            src='/static/List.svg'
            style={{
              width: "10px",
              marginRight: "10px",
              marginLeft: "5px"
            }}
          />
          <div className="header_title">{this.props.session.title}</div>
        </div>
        <div className="list-content-header">
          {this.props.session.listElements ? (
            childElements
          ) : (
              <div
                style={{ width: "100px", height: "100px", background: "red" }}
              />
            )}
          {this.props.session.isLoading && (
            <div className="box ">
              <div className="cssload-thecube-container-list">
                <div className="cssload-thecube-list">
                  <div className="cssload-cube cssload-c1" />
                  <div className="cssload-cube cssload-c2" />
                  <div className="cssload-cube cssload-c4" />
                  <div className="cssload-cube cssload-c3" />
                </div>
              </div>
            </div>
          )}
          {this.props.session.listElementsCount == 0 ? (
            <div style={{ textAlign: "center" }}>محتوایی جهت نمایش وجود ندارد.</div>
          ) : null}
        </div>
      </div>
    );
  }
}
