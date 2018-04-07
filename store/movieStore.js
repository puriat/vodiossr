import { action, observable } from "mobx";
import { MainUrl } from "../util/RequestHandler";
var moment = require("moment-jalaali");
import { latinToPersian, convertSecondToString } from "../util/util";
import $ from 'jquery'

let movieStore = null

class MovieStore {
  @observable movie = false;
  @observable related = "0";
  @observable movieId = -1;
  @observable director = null;
  @observable researcher = null;
  @observable actors = null;
  @observable animators = null;
  @observable cameramans = null;
  @observable editors = null;
  @observable writers = null;
  @observable composers = null;
  @observable provider = null;
  @observable relatedMovies = null;
  @observable durationString = "";
  @observable soundRecorders = null;
  @observable sounders = null;
  @observable redirectToMovie = false;

  @observable showLoading = "";

  @observable movieDetailClicked = false;
  @observable commentClicked = false;

  @observable goToTop = false;

  @action toJson() {
    return {
      movie: this.movie,
      related: this.related,
      movieId: this.movieId,
      director: this.director,
      researcher: this.researcher,
      actors: this.actors,
      animators: this.animators,
      cameramans: this.camermans,
      editors: this.editors,
      writers: this.writers,
      composers: this.composers,
      provider: this.provider,
      relatedMovies: this.relatedMovies,
      durationString: this.durationString,
      soundRecorders: this.soundRecorders,
      sounders: this.sounders,
      redirectToMovie: this.redirectToMovie,
      showLoading: this.showLoading,
      movieDetailClicked: this.movieDetailClicked,
      commentClicked: this.commentClicked,
      goToTop: this.goToTop
    }
  }

  constructor(json) {
    if (json != undefined && json != null) {
      this.movie = json.movie;
      this.related = json.related;
      this.movieId = json.movieId;
      this.director = json.director;
      this.researcher = json.researcher;
      this.actors = json.actors;
      this.animators = json.animators;
      this.cameramans = json.camermans;
      this.editors = json.editors;
      this.writers = json.writers;
      this.composers = json.composers;
      this.provider = json.provider;
      this.relatedMovies = json.relatedMovies;
      this.durationString = json.durationString;
      this.soundRecorders = json.soundRecorders;
      this.sounders = json.sounders;
      this.redirectToMovie = json.redirectToMovie;
      this.showLoading = json.showLoading;
      this.movieDetailClicked = json.movieDetailClicked;
      this.commentClicked = json.commentClicked;
      this.goToTop = json.goToTop;
    }
  }

  @action
  fetchRoles(roles) {
    if (roles == null) {
      $.ajax({
        type: "GET",
        url: MainUrl + "/role.ashx?movieId=" + this.movieId,
        success: function (data, textStatus, request) {
          var directorTemp;
          var ActorTemp;
          var providerTemp;
          var ResearcherTemp;
          var animatorTemp;
          var cameramanTemp;
          var editorTemp;
          var soundRecorderTemp;
          var writerTemp;
          var composerTemp;
          var sounderTemp;
          data.data.map(role => {
            if (role.name == "کارگردان") {
              directorTemp = role;
            } else if (role.name == "بازیگر") {
              ActorTemp = role;
            } else if (role.name == "تهیه کننده") {
              providerTemp = role;
            } else if (role.name == "پژوهشگر") {
              ResearcherTemp = role;
            } else if (role.name == "صدابردار") {
              soundRecorderTemp = role;
            } else if (role.name == "تدوین") {
              editorTemp = role;
            } else if (role.name == "نویسنده") {
              writerTemp = role;
            } else if (role.name == "آهنگ‌ساز") {
              composerTemp = role;
            } else if (role.name == "انیماتور") {
              animatorTemp = role;
            } else if (role.name == "صداگذار") {
              sounderTemp = role;
            }
          });
          this.director = directorTemp;
          this.researcher = ResearcherTemp;
          this.provider = providerTemp;
          this.actors = ActorTemp;
          this.editors = editorTemp;
          this.writers = writerTemp;
          this.composers = composerTemp;
          this.animators = animatorTemp;
          this.soundRecorders = soundRecorderTemp;
          this.sounders = sounderTemp;

          this.showLoading = false;
        }.bind(this),
        error: function (request, textStatus, errorThrown) {
          this.showLoading = false;
        }
      });
    } else {
      var directorTemp;
      var ActorTemp;
      var providerTemp;
      var ResearcherTemp;
      var animatorTemp;
      var cameramanTemp;
      var editorTemp;
      var soundRecorderTemp;
      var writerTemp;
      var composerTemp;
      var sounderTemp;
      roles.map(role => {
        if (role.name == "کارگردان") {
          directorTemp = role;
        } else if (role.name == "بازیگر") {
          ActorTemp = role;
        } else if (role.name == "تهیه کننده") {
          providerTemp = role;
        } else if (role.name == "پژوهشگر") {
          ResearcherTemp = role;
        } else if (role.name == "صدابردار") {
          soundRecorderTemp = role;
        } else if (role.name == "تدوین") {
          editorTemp = role;
        } else if (role.name == "نویسنده") {
          writerTemp = role;
        } else if (role.name == "آهنگ‌ساز") {
          composerTemp = role;
        } else if (role.name == "انیماتور") {
          animatorTemp = role;
        } else if (role.name == "صداگذار") {
          sounderTemp = role;
        }
      });
      this.director = directorTemp;
      this.researcher = ResearcherTemp;
      this.provider = providerTemp;
      this.actors = ActorTemp;
      this.editors = editorTemp;
      this.writers = writerTemp;
      this.composers = composerTemp;
      this.animators = animatorTemp;
      this.soundRecorders = soundRecorderTemp;
      this.sounders = sounderTemp;
    }
  }

  @action
  fetchRelated(related) {
    if (related == null) {
      $.ajax({
        type: "GET",
        url: MainUrl + "/related.ashx?movieId=" + this.movieId,
        success: function (data, textStatus, request) {
          this.relatedMovies = data.data;
        }.bind(this),
        error: function (request, textStatus, errorThrown) { }
      });
    } else {
      this.relatedMovies = related;
    }
  }

  @action
  fetchMovie(movie) {
    if (movie == null) {
      this.showLoading = true;
      $.ajax({
        type: "GET",
        url: MainUrl + "/movie.ashx?movieId=" + this.movieId,
        success: function (data, textStatus, request) {
          if (data.data != null) {
            this.movie = data.data;
            this.durationString = convertSecondToString(this.movie.duration);
            this.fetchRoles();
            this.fetchRelated();
            this.movieDetailClicked = false;
            this.commentClicked = false;
            this.goToTop = true;
            if (this.redirectToMovie == true && data.data.bought == true) {
              this.redirectToMovie = false;
            }
          } else {
          }
        }.bind(this),
        error: function (request, textStatus, errorThrown) {
          if (request.status == 403) {
            this.fetchMovie();
          }
        }.bind(this)
      });
    } else {
      this.movie = movie;
      this.durationString = convertSecondToString(this.movie.duration);
      this.movieDetailClicked = false;
      this.commentClicked = false;
      this.goToTop = true;
      if (this.redirectToMovie == true && movie.bought == true) {
        this.redirectToMovie = false;
      }
    }

  }
}


export function initMovieStore(isServer, json) {
  if (isServer) {
    return new MovieStore(json)
  } else {
    if (movieStore === null) {
      movieStore = new MovieStore(json)
    }
    return movieStore
  }
}
