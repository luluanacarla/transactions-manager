import React, { Component } from "react";
import PropTypes from "prop-types";

import Header from "./Header";
import { Footer } from "./Footer";

export default class TransactionsLayout extends Component {

  render() {
    const { children } = this.props;
    return (
      <div id="content" className="app-content box-shadow-z0" role="main">
        <Header />
        <Footer />
        <div
          id="view"
          className="app-body"
          ref={component => {
            this.mainPanel = component;
          }}
        >
          {children}
        </div>
      </div>
    );
  }
}

TransactionsLayout.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node
  ])
};

TransactionsLayout.defaultProps = {
  children: null
};
