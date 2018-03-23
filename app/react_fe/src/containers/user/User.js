import React, {Component} from 'react';
import sty from '../../css/bootstrap.min.css';
import Box from '../../components/box/Box';

class User extends Component {

    state = {
      login: true,
      username: "Userinfo"
    }

    render () {

      let userPanel;
      userPanel = (this.state.login) ? (<Box color="secondary" header={this.state.username}>Login Stuff</Box>) :
      (<Box color="secondary" header="Login required!">Please login to operate</Box>)

      return ( userPanel );
    }
}

const mapStateToProps = state => {
  return {
      issues: state.issue.issues,
      error: state.issue.error,
      errorMsg: state.issue.errorMsg
  };
};

// pass using props , this.props.onSetIssues
const mapDispatchToProps = dispatch => {
  return {
    //actionGetIssues: () => dispatch(Actions.getIssues())
  };
};



export default User;
