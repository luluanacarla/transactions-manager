import React, { Component } from "react";
import { PropTypes } from "prop-types";
import { Nav } from "reactstrap";
import { Link, withRouter } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };

    this.toggle = () => {
      const { isOpen } = this.state;
      this.setState({ isOpen: !isOpen });
    };
  }

  putActiveClass(route) {
    let isActive = "";
    const { location } = this.props;
    if (typeof route === "string") {
      isActive = location.pathname.indexOf(route) > -1 ? "active" : "";
    } else {
      route.forEach(r => {
        if (isActive === "") {
          isActive = this.putActiveClass(r);
        }
      });
    }
    return isActive;
  }

  render() {
    const { isOpen } = this.state;
    return (
      <div className="app-header red shadow">
        <div className="navbar navbar-expand-lg flex-row align-items-center">
          {/* Sidebar toggle button */}
          <button
            type="button"
            onClick={this.toggle}
            className="d-lg-none btn btn-link mr-3"
          >
            <FontAwesomeIcon icon="bars" color="white" />
          </button>

          {/* Brand */}
          <Link to="/transactions/list" className="navbar-brand mr-auto mr-lg-3">
            <h4 className="text-info font-weight-bold">
              Transactions Manager
            </h4>
          </Link>

          <div className={`navbar-collapse ${isOpen ? "" : "collapse"}`}>
            {/* Menu entries for the routes */}
            <Nav className="mr-auto nav-active-border b-primary" navbar>
              <li
                className={`nav-item ${this.putActiveClass("/trasactions/list")}`}
              >
                <Link to="/trasactions/list" className="nav-link">
                Transactions List
                </Link>
              </li>
              <li
                className={`nav-item ${this.putActiveClass("/transactions/create")}`}
              >
                <Link to="/transactions/create" className="nav-link">
                  Add new transaction
                </Link>
              </li>
            </Nav>
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  location: PropTypes.shape({
    pathname: PropTypes.string.isRequired
  }).isRequired
};

export default withRouter(Header);
