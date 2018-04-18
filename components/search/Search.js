import React from "react";
import { MainUrl } from "../../util/RequestHandler";
import { inject, observer } from "mobx-react";
import $ from 'jquery'
import Router from 'next/router'

@inject("session", "search", "movieStore")
@observer
export default class Search extends React.Component {
  constructor(props) {
    super(props);
    this.state = { searchResult: null, searchInputValue: "", sarachIndex: 0 };
  }

  componentDidMount() {
    $(window).click(
      function () {
        this.setState({ searchResult: null, searchInputValue: "" });
      }.bind(this)
    );

    $("#SearchDropdown").click(function (event) {
      event.stopPropagation();
    });
    $("#searchInput").click(function (event) {
      event.stopPropagation();
    });

    $("#searchInput").on(
      "keyup",
      function (e) {
        if (e.keyCode == 13) {
          this.onClick();
        }
      }.bind(this)
    );
  }

  searchSelectionAndHover() {
    $(".search-result-item").on(
      "mouseover",
      function (e) {
        var $listItems = $(".search-result-item");
        $listItems.removeClass("selected");
        if (e.target.id != undefined && e.target.id != "") {
          $("#" + e.target.id).addClass("selected");
        }
      }.bind(this)
    );

    var listItems = document.getElementsByClassName("search-result-item");
    $("#searchInput").on("keydown", function (e) {
      var key = e.keyCode,
        selected,
        current,
        index = -1;

      for (var i = 0; i < listItems.length; i++) {
        if (listItems[i].classList.contains("selected")) {
          selected = listItems[i];
          index = i;
        }
      }

      if (key != 40 && key != 38 && key != 13) return;
      if (selected != undefined && selected != null)
        $("#" + selected.id).removeClass("selected");

      if (key == 13) {
        if (selected != undefined && selected != null) {
          selected.click();
        }
        e.stopPropagation();
        return;
      } else if (key == 40) {
        // Down key
        if (index == listItems.length - 1) {
          current = listItems[0];
        } else {
          current = listItems[index + 1];
        }
      } else if (key == 38) {
        // Up key
        if (index == 0) {
          current = listItems[listItems.length - 1];
        } else {
          current = listItems[index - 1];
        }
      }
      $("#" + current.id).addClass("selected");
    });
  }

  close() {
    $(".header-search-drop").hide(200);
    $(".search-cover-page").fadeToggle(100);
    $("#SearchDropdown").fadeToggle(100);
  }

  toggleSearch() {
    this.setState({ searchInputValue: "" });
    this.setState({ searchResult: null });
    $(".header-search-drop").toggle(200);
    $(".search-cover-page").fadeToggle(100);
    $("#SearchDropdown").fadeToggle(100);
  }

  searchFunction(e) {
    this.setState({ searchInputValue: e.target.value });
    if (e.target.value.length > 2) {
      $.ajax({
        type: "GET",
        url: MainUrl + "/search.ashx?keyword=" + e.target.value,
        success: function (data, textStatus, request) {
          this.setState({ searchResult: data.data });
          $(".search-result-item").off("mouseover");
          $("#searchInput").off("keydown");
          this.searchSelectionAndHover();
        }.bind(this),
        error: function (request, textStatus, errorThrown) { }
      });
    } else {
      this.setState({ searchResult: null });
    }
  }

  search() {
    if (this.state.searchInputValue != "") {
      this.props.search.fetchSearchList(this.state.searchInputValue);
      Router.push("/search?keyword=" + this.state.searchInputValue, "/search/" + this.state.searchInputValue);
      this.setState({
        searchResult: null,
        searchInputValue: "",
        searchIndex: 0
      });
    } else {
      $(".search-container").addClass("no-input-shake");
      setTimeout(function () {
        $(".search-container").removeClass("no-input-shake");
      }, 500);
    }
  }

  onClick() {
    this.search();
  }

  movieClicked(movieId) {
    Router.push("/movie?id=" + movieId, "/movie/" + movieId, { shallow: true });
  }

  render() {
    return (
      <div id="searchContainer" className="search-container">
        <input
          id="searchInput"
          className="search-header-input search-dropdown"
          onChange={this.searchFunction.bind(this)}
          value={this.state.searchInputValue}
          placeholder="جستجو ..."
        />

        <img
          style={{
            width: "24px",
            height: "30px",
            padding: "5px"
          }}
          src='/static/img/search.svg'
          onClick={this.onClick.bind(this)}
        />

        {this.state.searchResult != null ? (
          <div id="SearchDropdown" className="search-dropdown-content">
            <div className="search-result">
              {this.state.searchResult.length == 0 ? (
                <div />
              ) : (
                  <ul id="search-result" style={{ width: "100%" }}>
                    {this.state.searchResult.map((search, l) => (
                      <li key={"li" + l} id={"li" + l} className="search-result-li" >
                        <a
                          id={"link" + l}
                          onClick={this.movieClicked.bind(this, search.id)}
                          className="search-result-item"
                        />
                        <div>
                          <span >
                            <span style={{ width: '100%' }}>{search.title}</span>
                            <span style={{ width: '100%' }}>{search.role + " : " + search.agent}</span>
                          </span>
                          <img
                            src={
                              MainUrl + "/image.ashx?file=" + search.thumbnail.url + "&width=200"
                            }
                          />
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
            </div>
          </div>
        ) : null}
      </div>
    );
  }
}
