import { action, observable } from "mobx"
import { MainUrl } from "../util/RequestHandler"
var moment = require("moment-jalaali")
import { latinToPersian, convertSecondToString } from "../util/util"

let sessionStore = null

class SessionStore {
  @observable session = null
  @observable showLogin = false
  @observable showFooter = true
  @observable history = null
  @observable showLoading = false

  @observable showPlayerFullscreen = false

  @observable isMobile = false
  @observable isIosDevice = false

  @observable movieIdForPurchase = -1

  @observable title = ""
  @observable reload = false
  @observable listElements = []
  @observable listElementsCount = -1
  @observable listUrl = ""
  @observable isLoading = false
  @observable offset = 0
  @observable size = 20
  @observable isInitiating = false

  @observable commentText = null
  @observable commentName = null
  @observable commentEmail = null
  @observable commentMovieId = -1

  @observable commentList = null
  @observable commentListCount = 0

  @observable categories = null
  @observable gaUrl = null

  @observable purchaseTitle = "خریدها"
  @observable purchaseListElements = []
  @observable purchaseListElementsCount = -1
  @observable purchaseListUrl = ""
  @observable purchaseIsLoading = false
  @observable purchaseOffset = 0
  @observable purchaseSize = 20
  @observable purchseIsInitiating = false

  @action toJson() {
    return {
      session: this.session,
      showLogin: this.showLogin,
      showFooter: this.showFooter,
      history: this.history,
      showLoading: this.showLoading,
      showPlayerFullscreen: this.showPlayerFullscreen,
      isMobile: this.isMobile,
      isIosDevice: this.isIosDevice,
      movieIdForPurchase: this.movieIdForPurchase,
      title: this.title,
      reload: this.reload,
      listElements: this.listElements,
      listElementsCount: this.listElementsCount,
      listUrl: this.listUrl,
      isLoading: this.isLoading,
      offset: this.offset,
      size: this.size,
      isInitiating: this.isInitiating,
      commentText: this.commentText,
      commentName: this.commentName,
      commentEmail: this.commentEmail,
      commentMovieId: this.commentMovieId,
      commentList: this.commentList,
      commentListCount: this.commentListCount,
      categories: this.categories,
      gaUrl: this.gaUrl,
      purchaseTitle: "خریدها",
      purchaseListElements: [],
      purchaseListElementsCount: -1,
      purchaseListUrl: "",
      purchaseIsLoading: false,
      purchaseOffset: 0,
      purchaseSize: 20,
      purchseIsInitiating: false
    }
  }

  constructor(json) {
    if (json != undefined && json != null) {
      this.session = json.session
      this.showLogin = json.showLogin
      this.showFooter = json.showFooter
      this.history = json.history
      this.showLoading = json.showLoading
      this.showPlayerFullscreen = json.showPlayerFullscreen
      this.isMobile = json.isMobile
      this.isIosDevice = json.isIosDevice
      this.movieIdForPurchase = json.movieIdForPurchase
      this.title = json.title
      this.reload = json.reload
      this.listElements = json.listElements
      this.listElementsCount = json.listElementsCount
      this.listUrl = json.listUrl
      this.isLoading = json.isLoading
      this.offset = json.offset
      this.size = json.size
      this.isInitiating = json.isInitiating
      this.commentText = json.commentText
      this.commentName = json.commentName
      this.commentEmail = json.commentEmail
      this.commentMovieId = json.commentMovieId
      this.commentList = json.commentList
      this.commentListCount = json.commentListCount
      this.categories = json.categories
      this.gaUrl = json.gaUrl
      this.purchaseTitle = "خریدها"
      this.purchaseListElements = []
      this.purchaseListElementsCount = -1
      this.purchaseListUrl = ""
      this.purchaseIsLoading = false
      this.purchaseOffset = 0
      this.purchaseSize = 20
      this.purchseIsInitiating = false
    }
  }

  @action fetchCommentList() {
    $.ajax({
      type: "Get",
      url: MainUrl + "/comments.ashx?movieId=" + this.commentMovieId,
      success: function (data, textStatus, jQxhr) {
        if (data.errorCode != 0) {
        } else {
          if (data.data != null) {
            data.data.forEach(element => {
              var date = new Date(element.millisecond)

              var m = moment(
                date.getUTCFullYear() +
                "/" +
                (date.getUTCMonth() + 1) +
                "/" +
                date.getUTCDate(),
                "YYYY/M/D"
              )

              var month = ""
              switch (m.jMonth()) {
                case 0:
                  month = "فروردین"
                  break
                case 1:
                  month = "اردیبهشت"
                  break
                case 2:
                  month = "خرداد"
                  break
                case 3:
                  month = "تیر"
                  break
                case 4:
                  month = "مرداد"
                  break
                case 5:
                  month = "شهریور"
                  break
                case 6:
                  month = "مهر"
                  break
                case 7:
                  month = "آبان"
                  break
                case 8:
                  month = "آذر"
                  break
                case 9:
                  month = "دی"
                  break
                case 10:
                  month = "بهمن"
                  break
                case 11:
                  month = "اسفند"
                  break
                default:
                  break
              }

              element.millisecond = latinToPersian(
                m.jDate() + " " + month + " " + m.jYear()
              )
            })
            this.commentList = data.data
            this.commentListCount = data.count
          }
        }
      }.bind(this),
      error: function (jqXhr, textStatus, errorThrown) {
      }
    })
  }

  @action
  fetchList(list, count) {
    if (list == null) {
      if (this.offset == 0) {
        this.listElements = []
        this.isLoading = false
      }
      $.ajax({
        type: "GET",
        url: this.listUrl + "&offset=" + this.offset + "&size=" + this.size,
        success: function (es, textStatus, request) {
          console.log(es)
          this.listElements = this.listElements.concat(es.data)
          this.listElementsCount = es.count
          this.isLoading = false
          this.offset = this.listElements.length
        }.bind(this),
        error: function (request, textStatus, errorThrown) { }
      })
    } else {
      this.listElements = list;
      this.listElementsCount = count;
      this.isLoading = false
      this.offset = list.length
    }
  }



  @action
  fetchPurchaseList() {
    if (this.purchaseOffset == 0) {
      this.purchaseListElements = []
      this.purchaseIsLoading = false
    }
    $.ajax({
      type: "GET",
      headers: {
        token: this.session
      },
      url:
        this.purchaseListUrl +
        "offset=" +
        this.purchaseOffset +
        "&size=" +
        this.purchaseSize,
      success: function (es, textStatus, request) {
        if (es.data != null) {
          this.purchaseListElements = this.purchaseListElements.concat(es.data)
        }
        this.purchaseListElementsCount = es.count
        this.purchaseIsLoading = false
      }.bind(this),
      error: function (request, textStatus, errorThrown) {
        if (request.status == 403) {
          this.session = null
          this.history.push("/")
        }
      }.bind(this)
    })
  }
}


export function initSessionStore(isServer, json) {
  if (isServer) {
    return new SessionStore(json)
  } else {
    if (sessionStore === null) {
      sessionStore = new SessionStore(json)
    }
    return sessionStore
  }
}