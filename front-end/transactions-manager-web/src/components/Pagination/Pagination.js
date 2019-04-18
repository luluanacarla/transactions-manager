import React, { Component } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import T from "i18n-react";
import API from "../API/API";

export class Pagination extends Component {
  constructor(props) {
    super(props);

    this.API = new API();

    this.state = {
      currentPage: 1,
      pageCount: 0,
      itemCount: 0
    };

    this.fetchItemCount = () => {

      const {
        itemsPerPage,
        resourceNameOnApi
      } = this.props;
      const { currentPage } = this.state;

      this.API.get(`/${resourceNameOnApi}/count`).then(response => {
        const pageCount = Math.ceil(response.data.count / itemsPerPage);
        let tempCurrentPage =
          currentPage >= pageCount ? pageCount : currentPage;
        if (tempCurrentPage === 0) {
          tempCurrentPage = 1;
        }
        this.setState(
          {
            pageCount,
            itemCount: response.data.count,
            currentPage: tempCurrentPage
          },
          () => {
            this.fetchItems();
          }
        );
      });
    };

    this.fetchItems = () => {
      const {
        itemsPerPage,
        filter: filterFromProps,
        resourceNameOnApi,
        onItemsReceived
      } = this.props;
      const { currentPage } = this.state;
      const currentSkip = itemsPerPage * (currentPage - 1);
      const filter = {
        ...filterFromProps,
        limit: itemsPerPage,
        skip: currentSkip
      };
      const params = {
        filter
      };
      const endpoint = `/${resourceNameOnApi}`;
      this.API.get(endpoint, { params }).then(response => {
        onItemsReceived(response.data);
      });
    };

    this.goToPage = page => {
      const { currentPage: actualPage, pageCount } = this.state;

      switch (page) {
        case "first":
          this.setState({ currentPage: 1 });
          break;
        case "last":
          this.setState(prevState => ({ currentPage: prevState.pageCount }));
          break;
        case "next":
          this.setState(prevState => ({
            currentPage:
              prevState.currentPage < prevState.pageCount
                ? prevState.currentPage + 1
                : prevState.pageCount
          }));
          break;
        case "previous":
          this.setState(prevState => ({
            currentPage:
              prevState.currentPage > 1 ? prevState.currentPage - 1 : 1
          }));
          break;
        default:
          if (page > 0 && page <= pageCount) {
            this.setState({ currentPage: page });
          }
          break;
      }

      const { currentPage } = this.state;

      if (actualPage !== currentPage) this.fetchItems();
    };
  }

  componentWillMount() {
    const { initialPage } = this.props;
    this.setState({ currentPage: initialPage });
  }

  componentDidMount() {
    this.fetchItemCount();
  }

  componentDidUpdate(prevProps, prevState) {
    const { currentPage } = this.state;
    const { filter } = this.props;
    if (prevState.currentPage !== currentPage) this.fetchItems();
    if (
      filter !== undefined &&
      prevProps.filter.order &&
      filter.order &&
      prevProps.filter.order !== filter.order
    ) {
      this.fetchItemCount();
    }
  }

  render() {
    const showPageButtons = () => {
      const { pageCount, currentPage } = this.state;
      const { maxPagesShown } = this.props;
      const pagesToShow = [];
      let firstPageShown;
      let lastPageShown;
      if (pageCount <= maxPagesShown) {
        firstPageShown = 1;
        lastPageShown = pageCount;
      } else {
        firstPageShown = currentPage - Math.floor(maxPagesShown / 2);
        lastPageShown = currentPage + Math.floor(maxPagesShown / 2);
        if (firstPageShown < 1) {
          lastPageShown = maxPagesShown;
          firstPageShown = 1;
        }
        if (lastPageShown > pageCount) {
          firstPageShown = pageCount - maxPagesShown + 1;
          lastPageShown = pageCount;
        }
      }
      for (let i = firstPageShown; i <= lastPageShown; i += 1) {
        pagesToShow.push(i);
      }

      return pagesToShow.map(page => (
        <li
          key={page}
          className={`page-item${currentPage === page ? " active" : ""}`}
        >
          <button
            type="button"
            className="page-link"
            onClick={() => {
              this.goToPage(page);
            }}
          >
            <span aria-hidden="true">{page}</span>
          </button>
        </li>
      ));
    };

    const { itemCount, pageCount, currentPage } = this.state;

    return (
      <nav aria-label="pagination">
        <ul className="pagination pagination-rounded justify-content-center mb-0">
          <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => {
                this.goToPage("first");
              }}
              title="First Page"
            >
              <FontAwesomeIcon icon="angle-double-left" />
            </button>
          </li>
          <li className={`page-item${currentPage === 1 ? " disabled" : ""}`}>
            <button
              type="button"
              className="page-link"
              onClick={() => {
                this.goToPage("previous");
              }}
              title="Previous"
            >
              <FontAwesomeIcon icon="angle-left" />
            </button>
          </li>
          {showPageButtons()}
          <li
            className={`page-item${
              currentPage === pageCount || itemCount === 0 ? " disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => {
                this.goToPage("next");
              }}
              title="Next"
            >
              <FontAwesomeIcon icon="angle-right" />
            </button>
          </li>
          <li
            className={`page-item${
              currentPage === pageCount || itemCount === 0 ? " disabled" : ""
            }`}
          >
            <button
              type="button"
              className="page-link"
              onClick={() => {
                this.goToPage("last");
              }}
              title="Last Page"
            >
              <FontAwesomeIcon icon="angle-double-right" />
            </button>
          </li>
        </ul>
      </nav>
    );
  }
}

Pagination.propTypes = {
  resourceNameOnApi: PropTypes.string.isRequired,
  onItemsReceived: PropTypes.func.isRequired,
  filter: PropTypes.objectOf(PropTypes.any),
  initialPage: PropTypes.number,
  itemsPerPage: PropTypes.number,
  maxPagesShown: PropTypes.number,
};

Pagination.defaultProps = {
  filter: {},
  initialPage: 1,
  itemsPerPage: 5,
  maxPagesShown: 5,
};

export default Pagination;
