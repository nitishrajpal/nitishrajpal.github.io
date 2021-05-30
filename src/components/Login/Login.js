import React, { Component } from 'react'
import { connect } from 'react-redux';
import './Login.css';
import { Form, Button } from 'react-bootstrap';
import * as actions from '../../store/actions/index'
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import axios from 'axios';

class Login extends Component {

    state = {
        email: '',
        password: '',
        isSignup: true,
        error: ''
    };

    componentDidMount () {
        if(this.props.authRedirectPath !== '/'){
            this.props.onSetAuthRedirectPath();
        }
        // console.log(this.props);
    }

    onEmailChangedHandler = (e) => {
        this.setState({ email: e.target.value });
    };

    onPasswordChangedHandler = (e) => {
        this.setState({ password: e.target.value });
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        let url = null;
        if(this.state.isSignup){
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signUp?key=AIzaSyA-RzTmtZwdknZJElci8ngvxps_wbVLjcQ';
        }
        else{
            url = 'https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=AIzaSyA-RzTmtZwdknZJElci8ngvxps_wbVLjcQ';
        }
        axios.post(url, {email: this.state.email, password: this.state.password, returnSecureToken: true})
        .then(response=>{
            const expirationDate = new Date(new Date().getTime() + response.data.expiresIn * 1000);
            localStorage.setItem('token', response.data.idToken);
            localStorage.setItem('expirationDate', expirationDate);
            localStorage.setItem('userId', response.data.localId);
            this.props.onSuccessfulAuth(response.data.idToken, response.data.localId);
            this.props.onCheckAuthTimeout(response.data.expiresIn);
            this.props.history.push('/home');
        })
        .catch(err=>{
            this.setState({ error: 'Something went wrong. Please try again!' });
        })
    };

    switchAuthModeHandler = () => {
        this.setState(prevState => {
            return { isSignup: !prevState.isSignup };
        });
    };

    clearErrorHandler = () => {
        this.setState({ error: '' });
    };

    render() {
    return (
        <div className="formContainer">
            {this.state.error ? <ErrorModal onClose={this.clearErrorHandler}>{this.state.error}</ErrorModal> : null}
            <Form onSubmit={this.onSubmitHandler}>
                <Form.Group controlId="formBasicEmail">
                <Form.Label>Email address</Form.Label>
                <Form.Control type="email" placeholder="Enter email" onChange={(event)=>this.onEmailChangedHandler(event)} />
                </Form.Group>

                <Form.Group controlId="formBasicPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control type="password" placeholder="Password" onChange={(event)=>this.onPasswordChangedHandler(event)} />
                </Form.Group>
                
                <Button variant="primary" type="submit" block>
                    Submit
                </Button>
            </Form>
            <Button id="switchAuth" variant="danger" block onClick={this.switchAuthModeHandler}>SWITCH TO {this.state.isSignup ? 'SIGN-IN' : 'SIGN-UP'}</Button>
        </div>
    )
}
}

const mapStateToProps = state => {
    return {
        loading: state.loading,
        error: state.error,
        isAuthenticated: state.token !== null,
        authRedirectPath: state.authRedirectPath
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onAuth: (email, password, isSignup) => dispatch(actions.auth(email, password, isSignup)),
        onSetAuthRedirectPath: () => dispatch(actions.setAuthRedirectPath('/')),
        onSuccessfulAuth: (token, localId) => dispatch(actions.authSuccess(token, localId)),
        onCheckAuthTimeout: (expiresIn) => dispatch(actions.checkAuthTimeout(expiresIn))
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);