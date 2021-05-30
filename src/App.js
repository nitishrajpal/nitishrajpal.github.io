import React, { Component } from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import Login from './components/Login/Login';
import NavbarUI from './components/UI/Navbar/NavbarUI';
import Dashboard from './components/Dashboard/Dashboard';
import NewSlip from './components/NewSlip/NewSlip';
import EditSlip from './components/EditSlip/EditSlip';
import Home from './components/Home/Home';
import * as actions from './store/actions/index';

class App extends Component {

  componentDidMount() {
    const token = localStorage.getItem('token');
        if(!token){
            this.props.onLogout();
        } else {
            const expirationDate = new Date(localStorage.getItem('expirationDate'));
            if(expirationDate > new Date()){
                const userId = localStorage.getItem('userId');
                this.props.onAuthSuccess(token, userId);
                this.props.onCheckAuthTimeout(expirationDate.getTime() - new Date().getTime() / 1000);
            } else {
              this.props.onLogout();
            }
        }
  }

  render(){
    let routes = (
      <Switch>
            <Route path="/auth" component={Login} />
            <Route path="/" component={Home} />
            <Redirect to='/' />
          </Switch>
    );

    if(this.props.isAuthenticated){
      routes= (
        <Switch>
        <Route path="/home" component={Dashboard} />
        <Route path="/newSlip" component={NewSlip} />
        <Route path="/editSlip" component={EditSlip} />
        <Route path="/" component={Home} />
        <Redirect to="/" />
      </Switch>
      );
    }
  return (
    <div className="App">
      <NavbarUI />
      {routes}
    </div>
  );
}
}

const mapStateToProps = state => {
  return {
    isAuthenticated: state.token !== null
  };
};

const mapDispatchToProps = dispatch => {
  return{
    onLogout: () => dispatch(actions.logout()),
    onAuthSuccess: (token, userId) =>  dispatch(actions.authSuccess(token, userId)),
    onCheckAuthTimeout: (expirationTime) => dispatch(actions.checkAuthTimeout(expirationTime))
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(App);
