import React from "react";
import { MainUrl } from "../../util/RequestHandler";
import { ToastContainer, toast, style } from "react-toastify";
import { latinToPersian, persianToLatin } from "../../util/util";
import { inject, observer } from "mobx-react";
import $ from 'jquery'

@inject("session")
@observer
export default class HeaderLogin extends React.Component {
  constructor() {
    super();

    this.state = {
      msisdn: "",
      toastId: null,
      textLoginInputValue: "",
      textLoginPlaceholderInputValue: "شماره همراه خود را وارد کنید",
      closeNotify: false,
      code: "",
      toastId: null
    };
  }

  componentDidMount() {
    if (localStorage.getItem("login") == "CODE_SENT") {
      this.setState({
        textLoginInputValue: "",
        textLoginPlaceholderInputValue: "کد فعال سازی ...",
        msisdn: localStorage.getItem("msisdn")
      });
    }
  }

  notify() {
    style({
      colorProgressDefault: "linear-gradient(to right, #fff , #eb0089)",
      TOP_LEFT: {
        top: "5.3em",
        left: "4em"
      },
      width: 288,
      zIndex: 9999
    });
    if (!toast.isActive(this.state.toastId)) {
      toast("کد فعال سازی برای شما پیامک شد.لطفا کد را وارد کنید.", {
        position: toast.POSITION.TOP_LEFT,
        closeButton: false
      });
    }
  }

  loginClicked() {
    if ($.trim(this.state.textLoginInputValue) == "") {
      $(".header-login-drop").addClass("no-input-shake");
      setTimeout(function () {
        $(".header-login-drop").removeClass("no-input-shake");
      }, 500);
    } else {
      $("#login-header-input-id").addClass("login-header-input-disabled");
      $("#login-header-input-id").removeClass("login-header-input");
      $(".login-header-submit").hide();
      $(".loader-container").css("display", "block");
      if (localStorage.getItem("login") == "CODE_SENT") {
        $.ajax({
          type: "GET",
          url:
            MainUrl +
            "/verify.ashx?msisdn=" +
            this.state.msisdn +
            "&code=" +
            persianToLatin(this.state.code),
          success: function (data, textStatus, request) {
            this.setState({ login: data });
            this.setState({ closeNotify: true });
            localStorage.setItem("session", data.data.token);
            this.props.session.session = data.data.token;
            $("#sign-out").addClass("header-sign-out");
            $(".header-login-drop").hide(200);
            $(".header-login").hide();
            this.setState({
              textLoginInputValue: "",
              textLoginPlaceholderInputValue: "شماره همراه خود را وارد کنید",
              closeNotify: false
            });

            $(".login-cover-page").hide();
            localStorage.removeItem("login");
            localStorage.removeItem("msisdn");
          }.bind(this),
          error: function (request, textStatus, errorThrown) { }
        });
      } else {
        $.ajax({
          type: "GET",
          url: MainUrl + "/login.ashx?msisdn=" + this.state.msisdn,
          success: function (data, textStatus, request) {
            this.setState({ login: data });
            this.notify();
            $("#login-header-input-id").addClass("login-header-input");
            $("#login-header-input-id").removeClass(
              "login-header-input-disabled"
            );
            this.setState({
              textLoginInputValue: "",
              textLoginPlaceholderInputValue: "کد فعال سازی ..."
            });
            $(".login-header-submit").show();
            $(".loader-container").css("display", "none");
            localStorage.setItem("msisdn", this.state.msisdn);
            localStorage.setItem("login", "CODE_SENT");
          }.bind(this),
          error: function (request, textStatus, errorThrown) { }
        });
      }
    }
  }

  onLoginFieldChange(e) {
    if (localStorage.getItem("login") == "CODE_SENT") {
      this.setState({ code: e.target.value });
    } else {
      this.setState({ msisdn: e.target.value });
    }
    this.setState({ textLoginInputValue: latinToPersian(e.target.value) });
  }

  signOutClicked() {
    localStorage.removeItem("session");
    localStorage.removeItem("msisdn");
    $(".header-login").show();
    $("#myDropdown").hide();
    $("#sign-out").removeClass("header-sign-out");
    this.props.session.session = null;

    $("#login-header-input-id").removeClass("login-header-input");
    $("#login-header-input-id").addClass("login-header-input-disabled");
    this.setState({
      textLoginInputValue: "",
      textLoginPlaceholderInputValue: "شماره همراه خود را وارد کنید",
      closeNotify: true
    });
    $(".login-header-submit").show();
    $(".loader-container").css("display", "none");
    $(".login-cover-page").fadeToggle(100);
  }

  myFunction() {
    $("#myDropdown").toggle("show");
  }

  closeLogin() {
    this.setState({
      closeNotify: true
    });
    $(".header-login-drop").hide(200);
    $(".login-cover-page").hide();
  }
  toggleLogin() {
    $(".header-login-drop").toggle(200);
    $(".login-cover-page").fadeToggle(100);
  }

  showLogin() {
    this.props.session.showLogin = true;
  }

  render() {
    return (
      <div className="header-login">
        {!this.state.closeNotify && (
          <ToastContainer
            toastClassName={{ font: " 500 .8em/40px 'IRSans',Sans-serif" }}
            autoClose={1}
          />
        )}
        <div
          className="header-login-win"
          onClick={this.showLogin.bind(this)}
        />
      </div>
    );
  }
}
