import React, { Component } from 'react'
import { connect } from 'react-redux';
import { Navbar, Nav, Button } from 'react-bootstrap';
import { NavLink } from 'react-router-dom';
import * as actions from '../../../store/actions/index';
import img from '../../../assets/images/grapecity.png';
import './Navbar.css';

class NavbarUI extends Component {

    onSignoutHandler = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('expirationDate');
        localStorage.removeItem('userId');
        this.props.onSuccessfulLogout();
    };

    render(){
    return (
        <div>
            <Navbar bg="primary" variant="dark" sticky="top">
                <NavLink to="/" exact><img src={img} width="50" height="50" alt="Logo"></img></NavLink>
                <Nav className="mr-auto">
                    <NavLink to="/home">Home</NavLink>
                    <NavLink to="/newSlip">New Slip</NavLink>
                    {this.props.isAuthenticated ? null : (<NavLink to="/auth">Authentication</NavLink>)}
                    {this.props.isAuthenticated ? (<Button variant="danger" onClick={this.onSignoutHandler}>Signout</Button>) : null}
                </Nav>
            </Navbar>
        </div>
    )
}
}

const mapStateToProps = state => {
    return {
      isAuthenticated: state.token !== null
    };
  };

const mapDispatchToProps = dispatch => {
    return{
        onSuccessfulLogout: () => dispatch(actions.logoutSucceed())
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(NavbarUI);
