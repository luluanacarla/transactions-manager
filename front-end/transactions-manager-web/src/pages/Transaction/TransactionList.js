import React, { Component } from "react";
import { Container, Row, Col, Table, Button } from "reactstrap";
import { Link } from "react-router-dom";
import T from "i18n-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import API from "../../components/API/API";
import { Pagination } from "../../components/Pagination/Pagination";
import SweetAlert from "sweetalert2-react";
import moment from "moment";

class Transaction extends Component {
  constructor(props) {
    super(props);

    this.API = new API();

    this.pagination = React.createRef();

    this.state = {
      resourceNameOnApi: "transactions",
      transactions: [],
      total:null,
      calculateTotalBalance: false,
      order: "id DESC"
    };

    this.delete = id => {
      const { resourceNameOnApi } = this.state;
      this.API.delete(`/${resourceNameOnApi}/${id}`).then(() => {
        this.pagination.current.fetchItems();
      });
    };

    this.getTotal = () => {
      const { resourceNameOnApi } = this.state;
      this.API.get(`/${resourceNameOnApi}/total`).then(res => {
        this.setState({ 
          calculateTotalBalance: true,
          total: res.data });
      })
    }
  }

  render() {
    const { transactions, resourceNameOnApi, order, showDeletionConfirmation,
      selectedItemToBeDeleted, total, calculateTotalBalance } = this.state;
    return [
      <Container key="transactions-list-container" fluid className="container-limited">
        <Row>
          <Col md={8}>
            <h3 className="text-secondary font-weight-bold mt-4">
             Transactions List
            </h3>
            <h4 className="text-secondary font-weight-light mb-3">
             Here you will find all your transactions
            </h4>
          </Col>
          <Col md={4} className="center">
          <Link
            to={{
              pathname: `/${resourceNameOnApi}/create`,
            }}
            className="btn btn-secondary btn-rounded px-3"
          >
            <FontAwesomeIcon icon="plus" /> Add new Transaction
          </Link>
          </Col>
        </Row>
        <div className="box">
          <Table responsive striped hover>
            <thead>
              <tr>
                <th>
                  {" "}
                  <span
                    className="table-header"
                    role="button"
                    tabIndex={-1}
                  >
                    Amount
                  </span>
                </th>
                <th>
                  {" "}
                  <span
                    className="table-header"
                    role="button"
                    tabIndex={-1}
                  >
                    Description
                  </span>
                </th>
                <th>
                  <span
                    className="table-header"
                    role="button"
                    tabIndex={-1}
                  >
                   Type
                  </span>
                </th>
                <th>
                  <span
                    className="table-header"
                    role="button"
                    tabIndex={-1}
                  >
                    Date
                  </span>
                </th>
                <th className="text-center">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {transactions.map(transaction => (
                <tr key={transaction.id}>
                  <td className="align-middle">R${transaction.amount}</td>
                  <td className="align-middle">
                    {transaction.description}
                  </td>
                  <td className="align-middle">
                    {transaction.type === 'credit' ? 'Credit' : 'Debit'}
                  </td>
                  <td className="align-middle">
                    {moment(transaction.date).format("LLLL")}
                  </td>
                  <td className="text-center py-0 align-middle">
                    <div className="btn-group" role="group">
                    <Link
                        className="btn btn-secondary btn-sm"
                        to={{
                          pathname: `/${resourceNameOnApi}/update/${transaction.id}`
                        }}
                        title="Update"
                      >
                        <FontAwesomeIcon icon="pencil-alt" fixedWidth />
                      </Link>
                        <Button
                          size="sm"
                          color="secondary"
                          title="Delete"
                          onClick={() => {
                            this.setState({
                              selectedItemToBeDeleted: transaction,
                              showDeletionConfirmation: true
                            });
                          }}
                        >
                          <FontAwesomeIcon icon="trash-alt" fixedWidth />
                        </Button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          <footer className="p-a dker">
            <Pagination
              ref={this.pagination}
              resourceNameOnApi="transactions"
              filter={{ order }}
              onItemsReceived={transactionsList => {
                this.setState({ transactions: transactionsList });
              }}
            />
          </footer>
        </div>
        <Button
                          size="md"
                          color="primary"
                          title="Delete"
                          onClick={this.getTotal}
                        >
                          <FontAwesomeIcon icon="calculator" fixedWidth /> Calculate current balance
                        </Button>
        { calculateTotalBalance && (
        <Row className="mt-4">
          <Col md={8}>
            <h4 className="text-secondary font-weight-light mb-3">
             Your current balance is R${total}
            </h4>
          </Col>
        </Row>
        )}
      </Container>,
      <SweetAlert
      key="sweet-alert"
      show={showDeletionConfirmation}
      title="Delete Transaction"
      text="Are you sure you want to delete this transaction?"
      type="warning"
      showCancelButton
      confirmButtonText="Delete"
      cancelButtonText="Cancel"
      confirmButtonClass="btn btn-primary btn-rounded mx-2 btn-lg px-5"
      cancelButtonClass="btn btn-secondary btn-rounded mx-2 btn-lg px-5"
      buttonsStyling={false}
      onConfirm={() => {
        this.delete(selectedItemToBeDeleted.id);
        this.setState({ showDeletionConfirmation: false });
      }}
    />
    ];
  }
}

export default Transaction;
