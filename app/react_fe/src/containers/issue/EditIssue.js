import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Redirect } from 'react-router-dom';
import * as Actions from '../../store/actions/';
import { Container, Row, Col } from 'reactstrap';
import Form from '../../components/form/Form';
import checkValidity from '../../utils/validateForm';
import Aux from '../../utils/auxiliary';
import Button from '../../components/button/Button';
import Modal from '../../components/modal/Modal';

class editIssue extends Component {

  componentDidMount() {
    this.props.getIssue(this.props.token, this.props.match.params.id);
  }

  state = {
      show: true,
      redirect: false,
      form: {
          description: {
              elementType: 'textarea',
              elementConfig: {
                  type: 'text',
                  placeholder: 'Description'
              },
              value: '',
              validation: {
                  required: true
              },
              valid: false,
              touched: false
          },
          priority: {
              elementType: 'select',
              elementConfig: {
                  options: [
                      {value: '', displayValue: 'Change priority'},
                      {value: 'urgent', displayValue: 'Urgent'},
                      {value: 'high', displayValue: 'High'},
                      {value: 'medium', displayValue: 'Medium'},
                      {value: 'low', displayValue: 'Low'}
                  ]
              },
              value: '',
              validation: {
                required: true,
                minLength: 1
              },
              valid: false
          },
          status: {
              elementType: 'select',
              elementConfig: {
                  options: [
                      {value: '', displayValue: 'Change the status'},
                      {value: 'open', displayValue: 'open'},
                      {value: 'closed', displayValue: 'closed'}
                  ]
              },
              value: '',
              validation: {
                required: true,
                minLength: 1
              },
              valid: false
          }
      },
      formIsValid: false,
  }


  closeModalHandler = () => {
    this.setState({ show: false });
    this.props.history.replace('/issues');
  }

  editIssueHandler = (event) => {
    event.preventDefault();
    let session_meta = { userId : this.props.userId, name : this.props.name};
    this.props.editIssue(this.props.token, this.props.issue_id, session_meta, this.state.form);
    this.setState({redirect: true });
  }

  inputChangedHandler = (event, inputIdentifier) => {
      const updatedform = {
          ...this.state.form
      };
      const updatedFormElement = {
          ...updatedform[inputIdentifier]
      };
      updatedFormElement.value = event.target.value;
      updatedFormElement.valid = checkValidity(updatedFormElement.value, updatedFormElement.validation);
      updatedFormElement.touched = true;
      updatedform[inputIdentifier] = updatedFormElement;

      let formIsValid = true;
      for (let inputIdentifier in updatedform) {
          formIsValid = updatedform[inputIdentifier].valid && formIsValid;
      }
      this.setState({form: updatedform, formIsValid: formIsValid});
  }

  render () {
      const formElementsArray = [];
      for (let key in this.state.form) {
          formElementsArray.push({
              id: key,
              config: this.state.form[key]
          });
      }
      let redirect = this.state.redirect ? <Redirect to="/issues"/> : null;
      let form = (
          <form onSubmit={this.editIssueHandler}>
              {formElementsArray.map(formElement => (
                  <Form
                      key={formElement.id}
                      elementType={formElement.config.elementType}
                      elementConfig={formElement.config.elementConfig}
                      value={formElement.config.value}
                      invalid={!formElement.config.valid}
                      shouldValidate={formElement.config.validation}
                      touched={formElement.config.touched}
                      changed={(event) => this.inputChangedHandler(event, formElement.id)} />
              ))}
              <Button disabled={!this.state.formIsValid} type={'disabled-stretch'}>Update</Button>
          </form>
      );


      return (<Modal show={this.state.show} close={this.closeModalHandler}>
                {redirect}
                <Container fluid>
                  <Row>
                    <Col md="6">
    
                    </Col>
                    <Col md="6">
                      {form}
                    </Col>
                  </Row>
                </Container>
              </Modal>);
    }
}
const mapStateToProps = state => {
  return {
      token: state.user.token,
      userId: state.user.userId,
      name: state.user.name,
      issue: state.issue.issue,
      error: state.issue.error,
      errorMsg: state.issue.errorMsg
  };
};

const mapDispatchToProps = dispatch => {
  return {
	   getIssue : (token, id) => dispatch(Actions.getIssue(token, id))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(editIssue);
