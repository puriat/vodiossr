import React from 'react'
import { initGA, logPageView } from '../util/analytics'
import Footer from './Footer'
import Header from './Header'
import { inject, observer } from "mobx-react"
import Login from './login/Login'
import { MainUrl } from "../util/RequestHandler";
import { latinToPersian, persianToLatin } from "../util/util";
import Loading from "./loading/Loading";
import '../css/style.css'

@inject("session")
@observer
export default class Layout extends React.Component {

    constructor(props) {
        super(props);

    }

    componentDidMount() {

        this.props.session.session =
            localStorage.getItem("session") != null
                ? localStorage.getItem("session")
                : null;
        this.props.session.history = this.props.history;

        var a = navigator.userAgent || navigator.vendor || window.opera;
        if (
            /(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows ce|xda|xiino|android|ipad|playbook|silk/i.test(
                a
            ) ||
            /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(
                a.substr(0, 4)
            )
        ) {
            this.props.session.isMobile = true;
        }

        if (
            navigator.userAgent.match(/iPhone/i) ||
            navigator.userAgent.match(/iPad/i) ||
            navigator.userAgent.match(/iPod/i)
        ) {
            this.props.session.isIosDevice = true;
        }


        this.fixedHeader();
        var mainHeight =
            $(window).height() - $("#footer").height() - $("#header").height() - 136;
        $(".main-holder").css("min-height", mainHeight);

        if (localStorage.getItem("session") && localStorage.getItem("msisdn")) {
            $.ajax({
                type: "GET",
                headers: {
                    token: localStorage.getItem("session")
                },
                url:
                    MainUrl +
                    "/login.ashx?msisdn=" +
                    persianToLatin(localStorage.getItem("msisdn")),
                success: function (data, textStatus, request) {
                    if (data.data.token != null) {
                        localStorage.setItem("session", data.data.token);
                        this.props.session.session = data.data.token;
                    } else {
                        localStorage.removeItem("session");
                        localStorage.removeItem("msisdn");
                        localStorage.removeItem("otp");
                        this.props.session.session = null;
                    }
                }.bind(this),
                error: function (request, textStatus, errorThrown) {
                    localStorage.removeItem("session");
                    localStorage.removeItem("msisdn");
                    localStorage.removeItem("otp");
                    this.props.session.session = null;
                }.bind(this)
            });
        } else {
            localStorage.removeItem("session");
            localStorage.removeItem("msisdn");
            localStorage.removeItem("otp");
            this.props.session.session = null;
        }
    }

    fixedHeader() {
        var mainHeight =
            $(window).height() - $("#footer").height() - $("#header").height() - 210;

        if ($(".main-holder").height() > mainHeight) {
            var nav = $("#header");
            var mainHolder = $(".main-holder");
            var navHomeY = nav.offset().top;
            var isFixed = false;
            var $w = $(window);

            $w.scroll(function () {
                var scrollTop = $w.scrollTop();
                var shouldBeFixed = scrollTop > navHomeY;
                if (shouldBeFixed && !isFixed) {
                    if ($w.width() > 520) {
                        mainHolder.css({ margin: "100px auto 0" });
                    } else {
                        mainHolder.css({ margin: "65px auto 0" });
                    }
                    nav.css({
                        position: "fixed",
                        background: "rgba(255,255,255,1)",
                        boxShadow: "0 20px 30px rgba(0,0,0,.1)",
                        top: 0,
                        left: nav.offset().left,
                        width: nav.width()
                    });
                    isFixed = true;
                } else if (!shouldBeFixed && isFixed) {
                    nav.css({
                        position: "absolute",
                        boxShadow: "none"
                    });
                    isFixed = false;
                }
            });
        }
    }
    // componentDidMount() {
    //     if (!window.GA_INITIALIZED) {
    //         initGA()
    //         window.GA_INITIALIZED = true
    //     }
    //     logPageView()
    // }
    render() {
        return (
            <div>
                <Header></Header>
                {this.props.children}
                <Footer></Footer>
                {this.props.session.showLogin && <Login />}
                {this.props.session.showLoading && <Loading />}
            </div>
        )
    }
}
