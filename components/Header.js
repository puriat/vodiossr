import React, { Component } from "react";
import { MainUrl } from "../util/RequestHandler";
import { inject, observer } from "mobx-react";
import Search from "./search/Search";
import HeaderLogin from "./login/HeaderLogin";
import Link from 'next/link'
import Category from "./Category";
import $ from 'jquery'
import fetch from 'isomorphic-unfetch'

@inject("session")
@observer
export default class Header extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            code: ""
        };
    }

    componentDidMount() {
        $(window).click(
            function () {
                $("#myDropdown").hide(100);
            }.bind(this)
        );

        $(".header-sign-out").click(function (event) {
            event.stopPropagation();
        });

        $(".header-sign-out").click(function (event) {
            if ($("#myDropdown").css("display") == "none")
                $("#myDropdown").toggle(100);
            event.stopPropagation();
        }.bind(this));
        $(window).click(function () {
            if ($(window).width() < 1001) {
                $(".header-menu").hide(100);
                $("#myDropdown").hide(100);
            }
        });

        $("#menucontainer").click(function (event) {
            event.stopPropagation();
        });

        if (this.props.session.categories == null) {
            fetch(MainUrl + "/category.ashx").then(r => r.json()).then(data => {
                this.props.session.categories = data.data

            });
        }
    }

    signOutClicked() {
        localStorage.removeItem("session");
        $(".header-login").show();
        $("#myDropdown").hide();
        $("#sign-out").removeClass("header-sign-out");
        this.props.session.session = null;

        $("#login-header-input-id").removeClass("login-header-input");
        $("#login-header-input-id").addClass("login-header-input-disabled");
        $(".login-header-submit").show();
        $(".loader-container").css("display", "none");
    }

    purchaseList() {
        this.props.session.history.push("/purchase");
        this.props.session.purchaseOffset = 0;
        this.props.session.purchaseListUrl = MainUrl + "/userpurchases.ashx?";
        this.props.session.purchaseIsInitiating = true;
        this.props.session.purchaseTitle = "خریدها";
        this.props.session.fetchPurchaseList();
        $("#myDropdown").hide(100);
    }

    factorList() {
        this.props.session.history.push("/factors");
    }

    render() {
        return (
            <header id="header" style={{ background: "white" }}>
                <div className="header-inner max-width">
                    <Link href="/">
                        <a>
                            <img
                                className="vodio-logo"
                                src='/static/img/Vodio-Logo.svg'
                                alt="وودیو"
                            />
                        </a>
                    </Link>
                    <span className="show-main-menu-btn icon-menu-1" />
                    {this.props.session.categories != null && <Category categories={this.props.session.categories} />}
                    <div style={{
                        paddingLeft: '10px'
                    }} >
                        {/* <nav className="header-menu">
              <ul className="header-menu-ul">
                <li>
                  <Link to={{ pathname: "/" }}>
                    <span className="home-icon-img" />
                    <div className="home-menu-title">صفحه‌اصلی</div>
                  </Link>
                </li>
                <li>
                  <a href="#">
                    <span className="ask-movie-icon-img" />
                    <div className="home-menu-title">درخواست فیلم</div>
                  </a>
                </li>
              </ul>
            </nav> */}
                        <div
                            style={{
                                display: "inline-flex",
                                float: "left",
                                direction: "rtl"
                            }}
                        >
                            {/* <Search /> */}
                            <div className="header-left-meta">
                                {this.props.session.session != null &&
                                    this.props.session.session != "" ? (
                                        <div className="header-sign-out-panel">
                                            <div
                                                className="dropdown"
                                                id="sign-out"
                                                className="header-sign-out"
                                            />
                                            <div id="myDropdown" className="dropdown-content">
                                                <a onClick={this.purchaseList.bind(this)}>خریدها</a>
                                                <a onClick={this.factorList.bind(this)}>فاکتورها</a>
                                                {/* <a href="#contact">پروفایل</a> */}
                                                <a onClick={this.signOutClicked.bind(this)}>خروج</a>
                                            </div>
                                        </div>
                                    ) : (
                                        <HeaderLogin />
                                    )}
                            </div>
                        </div>
                    </div>
                </div >
                {/* <a className="test-popup-link" href="http://cinemamarket.ir/UploadedData/1/Contents/poster/Vilaeeha(Po-NLogo-1)-HTS-CinemaMarket.jpg">Open popup</a> */}
            </header >
        );
    }
}
