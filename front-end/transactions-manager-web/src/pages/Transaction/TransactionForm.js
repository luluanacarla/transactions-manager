import React, { Component } from "react";
import PropTypes from "prop-types";
import DatePicker from "react-datepicker";
import moment from "moment";
import { Redirect, withRouter } from "react-router-dom";
import Select from "react-select";
import get from "get-value";
import {
  Container,
  Row,
  Col,
  Button,
  FormGroup,
  Input,
  Label
} from "reactstrap";
import API from "../../components/API/API";
import CurrencyInput from 'react-currency-input';

import "react-datepicker/dist/react-datepicker.css";

class TransactionForm extends Component {
  constructor(props) {
    super(props);

    this.API = new API();

    const { match } = this.props;

    this.state = {
      isNewRecord: !match.params.id,
      redirectTo: "",
      resourceNameOnApi: "transactions",
      showAlert:false,
      resource: {
        amount: null,
        description: null,
        type: null,
        date: null
      },
      hiddenPropertyNamesOnForm: [
        "id",
        "pickupDatetime"
      ],
      selectedDatetime:null,
      selectedType: null,
      typeSelectOptions: [
        { value: 'credit', label: 'Credit' },
        { value: 'debit', label: 'Debit' },
      ]
    };

    /**
     * Callback for when user input some data on form fields.
     * It saves the data in their component state.
     * @param event
     */
    this.handleInputChange = event => {
      const { target } = event;
      const { name } = target;
      let { value } = target;

      this.setState(prevState => ({
        showAlert:false,
        resource: { ...prevState.resource, [name]: value }
      }));
    };

     /**
     * Callback for when user input some data on form fields.
     * It saves the data in their component state.
     * @param event
     * @param maskedvalue
     * @param floatvalue
     */
    this.handleInputCurrencyChange = (event, maskedvalue, floatvalue) => {
      this.setState(prevState => ({
        showAlert:false,
        resource: { ...prevState.resource, amount: floatvalue }
      }));
    };

    /**
     * Callback for when user submits the form.
     * It sends the data to database via API.  @param event
     */
    this.handleSubmit = event => {
      event.preventDefault();
      const { resource } = this.state;
      if(resource.amount === null
        || resource.description === null
        || resource.type === null
        || resource.date === null) {
          this.setState({ showAlert:true });
         
        }
        else {
          this.save(resource);
        }
     
    };

    /**
     * Checks if there's an ID set (on URL). If so, updates the record. Otherwise creates one.
     * @param data
     */
    this.save = async data => {
      const { resourceNameOnApi } = this.state;

      try {
        await this.API.put(`/${resourceNameOnApi}`, data);
        this.setState(prevState => ({
          redirectTo: `/${prevState.resourceNameOnApi}/list`
        }));
      } catch (err) {
        const { log } = console;
        log("err", err);
      }
    };

    /**
     * Returns the select option (used in react-select) component,
     * based on the resource retrieved from database.
     * @param type
     * @return {{value: *, label: string}}
     */
    this.buildTypeOptionFromTheResource = type => ({
      value: type,
      label: type === 'credit' ? 'Credit' : 'Debit'
    });

    /**
     * Loads in the form the data from resource to be updated.
     */
    this.loadResourceIfNeeded = () => {
      const { resourceNameOnApi } = this.state;
      if (match.params.id) {
        this.API.get(`/${resourceNameOnApi}/${match.params.id}`).then(response => {
          this.setState({ resource: response.data }, () => {
            this.setState(prevState => ({
              selectedDatetime: prevState.resource.date
                ? moment(prevState.resource.date)
                : null,
                selectedType: prevState.resource.type
                ? this.buildTypeOptionFromTheResource(prevState.resource.type)
                : null,
            }));
          });
        });
      }
    };


    /**
     * Callback function to when user selects the PickupDatetime.
     * @param {Date} date
     */
    this.handleDatetimeChange = date => {
      this.setState(prevState => ({
        selectedDatetime: date,
        showAlert:false,
        resource: {
          ...prevState.resource,
          date: date
        }
      }));
    };

    /**
     * Callback function to when user selects some value on Type
     * form field. Saves type to this component state.
     * @param {Object} selectedType
     */
    this.handleChangeOnType = selectedType => {
      console.log(selectedType)
      this.setState({ selectedType });
      if (selectedType === null) {
        this.setState(prevState => ({
          showAlert:false,
          resource: {
            ...prevState.resource,
            type: null,
          }
        }));
      } else {
        this.setState(prevState => ({
          showAlert:false,
          resource: {
            ...prevState.resource,
            type: get(selectedType, "value", null),
          }
        }));
      }
    };
  }

  async componentDidMount() {
    await this.loadResourceIfNeeded();
  }

  render() {
    const {
      redirectTo,
      isNewRecord,
      resource,
      hiddenPropertyNamesOnForm,
      selectedDatetime,
      selectedType,
      typeSelectOptions,
      showAlert
    } = this.state;
    const { history } = this.props;

    if (redirectTo) return <Redirect to={redirectTo} />;

    return (
      <Container fluid className="container-limited">
      <Row>
          <Col md={8}>
            <h3 className="text-secondary font-weight-bold mt-4">
             Transactions Form
            </h3>
            <h4 className="text-secondary font-weight-light mb-3">
             Here, you can add new transactions
            </h4>
          </Col>
        </Row>
        <form onSubmit={event => this.handleSubmit(event)}>
          <Row>
            <Col md={12}>
            {showAlert && (
             <div className="alert alert-danger" role="alert">
             You can not leave blank fields!

           </div>
            )}

              <div className="box">
                <div className="box-body">
                  {Object.keys(resource).map(propertyName => {
                     if (hiddenPropertyNamesOnForm.includes(propertyName)) {
                      return null;
                    }
                    if (propertyName === "description") {
                      return (
                        <FormGroup key={propertyName}>
                          <Label>Description</Label>
                          <Input
                                      type="text"
                                      name={propertyName}
                                      value={resource.description || ""}
                                      onChange={this.handleInputChange}
                                    />
                        </FormGroup>
                      );
                    }

                    if (propertyName === "type") {
                      return (
                        <FormGroup key={propertyName}>
                          <Label>Type</Label>
                          <Select
                            name="form-field-name"
                            value={selectedType}
                            onChange={this.handleChangeOnType}
                            options={typeSelectOptions}
                            placeholder="Type"
                            isClearable={false}
                            className="react-select-container"
                            classNamePrefix="react-select"
                          />
                        </FormGroup>
                      );
                    }

                    if (propertyName === "date") {
                      return (
                        <FormGroup key={propertyName}>
                          <Label>
                            Date
                          </Label>
                          <DatePicker
                            selected={selectedDatetime}
                            onChange={this.handleDatetimeChange}
                            showTimeSelect
                            timeFormat="HH:mm"
                            timeIntervals={15}
                            dateFormat="LLL"
                            className="form-control"
                          />
                        </FormGroup>
                      );
                    }

                    return (
                      <FormGroup key={propertyName}>
                        <Label>
                          Amount
                        </Label>
                        <CurrencyInput 
                        value={resource[propertyName] || ""} 
                        onChangeEvent={this.handleInputCurrencyChange}
                        decimalSeparator="," thousandSeparator="." prefix="R$"
                        className="form-control"/>
                      </FormGroup>
                    );
                  })}
                </div>
              </div>
            </Col>
          </Row>
          <div className="clearfix text-center">
            <Button
              onClick={history.goBack}
              className="btn btn-rounded btn-lg btn-secondary float-md-left px-5"
            >
              Go Back
            </Button>
            <Button
              size="lg"
              color="primary"
              className="btn-rounded float-md-right m-auto px-5"
              onClick={event => this.handleSubmit(event)}
            >
              {isNewRecord
                ? "Create"
                : "Update"}
            </Button>
          </div>
        </form>
      </Container>
    );
  }
}

TransactionForm.propTypes = {
  match: PropTypes.shape({
    params: PropTypes.shape({
      id: PropTypes.string
    })
  }),
  history: PropTypes.shape({
    goBack: PropTypes.func.isRequired
  }).isRequired
};

TransactionForm.defaultProps = {
  match: {
    params: {
      id: ""
    }
  }
};

export default withRouter(TransactionForm);
