import React from "react";
import infiniteSS from "styles/infinite.css";
import Link from 'next/link'
import { inject, observer } from "mobx-react";
import { MainUrl } from "../../util/RequestHandler";

@inject("session", "search")
@observer
export default class SearchList extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    this.props.session.showFooter = false;
    window.onscroll = function () {
      if (
        this.props.search.aElements != null &&
        this.props.search.aElements.length != this.props.search.aCount &&
        $("#" + this.props.search.aLastElementId).visible() &&
        this.props.search.isLoading == false
      ) {
        this.props.search.fetchANextSearchList();
      }
    }.bind(this);

    $("body").css("background", "#eeeeee");

    require("jquery-visible")
  }

  componentWillUnmount() {
    $("body").css("background", "white");
    this.props.session.showFooter = true;
  }

  filterClicked(e, filter) {
    var elems = Array.prototype.slice.call(document.getElementsByClassName("search-filter"))
    elems.forEach(element => {
      element.classList.remove("search-filter-active")
    });
    e.currentTarget.classList.add("search-filter-active")
    this.props.search.filter = filter;
    this.props.search.fetchASearchList(this.props.search.keyword);
  }

  render() {
    var childElements = null;
    if (this.props.search.aElements != null) {
      childElements = this.props.search.aElements.map(
        function (element, l) {
          if (element != null) {
            var width = $(window).width();
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
            return (
              <div id={"element" + l} className="box movie-list-item" style={{ paddingRight: '5px', paddingLeft: '5px' }} key={l}>
                <Link href={"/movie/" + element.id}>
                  <a>
                    <div className="movie-list-item-link">
                      <span className="movie-list-item-cover">
                        <img
                          className={"movie-list-item-img"}
                          src={
                            MainUrl +
                            "/image.ashx?file=" +
                            element.thumbnail.url +
                            "&width=" +
                            width +
                            "&height=" +
                            height
                          }
                        />
                      </span>
                      <div style={{ height: '15px' }}></div>
                    </div>
                  </a>
                </Link>
              </div >
            );
          }
        }.bind(this)
      );
    }


    return (
      <div className="movie-list vodio-container" style={{ paddingTop: "20px" }}>
        <style dangerouslySetInnerHTML={{ __html: infiniteSS }} />
        <div style={{
          position: 'relative',
          height: '30px',
          marginTop: '20px',
          display: 'block',
          width: '100%'
        }}>
          <img src='/static/img/clapperboard.png' style={{
            width: '15px', float: 'right',
            marginTop: '5px',
            marginLeft: '10px',
            marginRight: '5px'
          }} />
          <div style={{
            fontSize: '13px',
            fontFamily: 'irsansbold', float: 'right',
            marginTop: '5px'
          }}>نتایج جستجو / </div>
          <div style={{
            fontSize: '13px',
            fontFamily: 'irsansbold',
            color: '#eb0089',
            marginRight: '10px',
            marginLeft: '5px',
            float: 'right',
            marginTop: '5px'
          }}>{this.props.search.keyword}</div>
          <div onClick={(e) => this.filterClicked(e, "فیلم")} className="search-filter search-filter-active">فیلم</div>
          <div onClick={(e) => this.filterClicked(e, "کارگردان")} className="search-filter">کارگردان</div>
          <div onClick={(e) => this.filterClicked(e, "بازیگر")} className="search-filter">بازیگر</div>
          <div onClick={(e) => this.filterClicked(e, "آهنگ‌ساز")} className="search-filter">آهنگ‌ساز</div>
          <div onClick={(e) => this.filterClicked(e, "انیماتور")} className="search-filter">انیماتور</div>
          <div onClick={(e) => this.filterClicked(e, "تدوین")} className="search-filter">تدوین</div>
          <div onClick={(e) => this.filterClicked(e, "تهیه کننده")} className="search-filter">تهیه کننده</div>
          <div onClick={(e) => this.filterClicked(e, "صدابردار")} className="search-filter">صدابردار</div>
          <div onClick={(e) => this.filterClicked(e, "فیلم‌بردار")} className="search-filter">فیلم‌بردار</div>
          <div onClick={(e) => this.filterClicked(e, "نویسنده")} className="search-filter">نویسنده</div>
        </div>

        <div className="list-content-header">
          {this.props.search.aElements != null && childElements}
          {this.props.search.aCount == 0 && (
            <div style={{ width: "100%", textAlign: "center" }}>
              نتیجه ای یافت نشد.
            </div>
          )}
          {this.props.search.isLoading && (
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
        </div>
      </div>
    );
  }
}
