import React from "react";
import "../../css/loading.css";

export default class Loading extends React.Component {
  render() {
    return (
      <div className="cssload-thecube-container">
        <div className="cssload-thecube">
          <div className="cssload-cube cssload-c1" />
          <div className="cssload-cube cssload-c2" />
          <div className="cssload-cube cssload-c4" />
          <div className="cssload-cube cssload-c3" />
        </div>
      </div>
    );
  }
}
