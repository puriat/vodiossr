import { action, observable } from "mobx"
import { MainUrl } from "../util/RequestHandler"
var moment = require("moment-jalaali")
import { latinToPersian, convertSecondToString } from "../util/util"
import $ from 'jquery'

let searchStore = null

class SearchStore {
    @observable isLoading = false
    @observable elements = null
    @observable firstLoad = true
    @observable keyword = null
    @observable offset = 0
    @observable size = 20
    @observable count = -1
    @observable lastElementId = "0"

    @observable filter = "0";
    @observable aOffset = 0;
    @observable aSize = 30;
    @observable aLastElementId = "0";
    @observable aElements = null;
    @observable aCount = -1;

    @action toJson() {
        return {
            isLoading: this.isLoading,
            elements: this.elements,
            firstLoad: this.firstLoad,
            keyword: this.keyword,
            offset: this.offset,
            size: this.size,
            count: this.count,
            lastElementId: this.lastElementId,
            filter: this.filter,
            aOffset: this.aOffset,
            aSize: this.aSize,
            aLastElementId: this.aLastElementId,
            aElements: this.aElements,
            aCount: this.aCount
        }
    }

    constructor(json) {
        if (json != undefined && json != null) {
            this.isLoading = json.isLoading
            this.elements = json.elements
            this.firstLoad = json.firstLoad
            this.keyword = json.keyword
            this.offset = json.offset
            this.size = json.size
            this.count = json.count
            this.lastElementId = json.lastElementId
            this.filter = json.filter
            this.aOffset = json.aOffset
            this.aSize = json.aSize
            this.aLastElementId = json.aLastElementId
            this.aElements = json.aElements
            this.aCount = json.aCount
        }
    }

    @action
    fetchSearchList(kw) {
        this.offset = 0
        this.count = -1
        this.elements = null
        this.firstLoad = true
        this.lastElementId = "0"
        this.keyword = kw
        var url = MainUrl + "/Search.ashx?keyword=" + kw + "&size=" + this.size
        $.ajax({
            type: "GET",
            url: url,
            success: function (data, textStatus, request) {
                this.count = data.count
                if (data.data != null)
                    this.lastElementId = "element" + (data.data.length - 1)
                this.elements = data.data
                this.firstLoad = false
                if (data.data != null)
                    this.offset = data.data.length
            }.bind(this),
            error: function (request, textStatus, errorThrown) { }
        })
    }

    @action
    fetchNextSearchList() {
        this.isLoading = true
        var url =
            MainUrl +
            "/Search.ashx?keyword=" +
            this.keyword +
            "&offset=" +
            this.offset +
            "&size=" +
            this.size
        $.ajax({
            type: "GET",
            url: url,
            success: function (data, textStatus, request) {
                var items = this.elements.concat(data.data)
                this.lastElementId = "element" + (items.length - 1)
                this.isLoading = false
                this.offset = items.length - 1
                this.elements = items
            }.bind(this),
            error: function (request, textStatus, errorThrown) { }
        })
    }

    @action
    fetchASearchList(kw, list) {
        if (list == null) {
            this.aOffset = 0;
            this.aCount = -1;
            this.aElements = null;
            this.firstLoad = true;
            this.aLastElementId = "0";
            this.keyword = kw;
            var url = MainUrl + "/advanceSearch.ashx?keyword=" + kw + "&size=" + this.aSize + "&filter=" + this.filter;
            $.ajax({
                type: "GET",
                url: url,
                success: function (data, textStatus, request) {
                    this.aCount = data.count;
                    if (data.data != null)
                        this.aLastElementId = "element" + (data.data.length - 1);
                    this.aElements = data.data;
                    this.firstLoad = false;
                    if (data.data != null)
                        this.aOffset = data.data.length;
                }.bind(this),
                error: function (request, textStatus, errorThrown) { }
            });
        } else {
            this.keyword = kw;
            this.aCount = list.count;
            this.aLastElementId = "element" + (list.length - 1);
            this.aElements = list;
            this.aOffset = list.length;
        }
    }

    @action
    fetchANextSearchList() {
        this.isLoading = true;
        var url =
            MainUrl +
            "/Search.ashx?keyword=" +
            this.keyword +
            "&offset=" +
            this.aOffset +
            "&size=" +
            this.aSize +
            "&filter=" + this.filter;
        $.ajax({
            type: "GET",
            url: url,
            success: function (data, textStatus, request) {
                var items = this.aElements.concat(data.data);
                this.aLastElementId = "element" + (items.length - 1);
                this.isLoading = false;
                this.aOffset = items.length - 1;
                this.aElements = items;
            }.bind(this),
            error: function (request, textStatus, errorThrown) { }
        });
    }
}

export function initSearchStore(isServer, json) {
    if (isServer) {
        return new SearchStore(json)
    } else {
        if (searchStore === null) {
            searchStore = new SearchStore(json)
        }
        return searchStore
    }
}
