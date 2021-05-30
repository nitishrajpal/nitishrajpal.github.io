import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import './NewSlip.css';

class NewSlip extends Component {

    state = {
        id: '',
        name: '',
        vehicle: '',
        vehicleType: '4 wheeler',
        registrationNumber: '',
        inTime: '',
        outTime: '',
        userId: ''
    };

    componentDidMount(){
        console.log(this.props);
    }

    onNameChangeHandler = (e) => {
        this.setState({ name: e.target.value });
    };

    onVehicleChangeHandler = (e) => {
        this.setState({ vehicle: e.target.value });
    };

    onVehicleTypeChangeHandler = (e) => {
        this.setState({ vehicleType: e.target.value });
    };

    onRegistrationChangeHandler = (e) => {
        this.setState({ registrationNumber: e.target.value });
    };

    onSubmitHandler = (e) => {
        e.preventDefault();
        var now = new Date().toLocaleString();
        this.setState({ inTime: now, userId: this.props.userId }, () => {
            console.log(this.state.userId);
            axios.post('https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip.json?auth=' + this.props.token, this.state)
            .then(res => {
                console.log(res);
                this.props.history.push('/home');
            })
            .catch(err => {
                console.log(err);
            });
        });
    };

    render(){
    return (
        <div className="formContainer">
            <Form onSubmit={this.onSubmitHandler}>
                <Form.Group controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder="Full Name" onChange={(event)=>this.onNameChangeHandler(event)} />
                </Form.Group>

                <Form.Group controlId="formGridVehicle">
                    <Form.Label>Vehicle</Form.Label>
                    <Form.Control placeholder="Vehicle" onChange={(event)=>this.onVehicleChangeHandler(event)} />
                </Form.Group>

                <Form.Group controlId="formGridVehicleType">
                    <Form.Label>Vehicle Type</Form.Label>
                    <Form.Control as="select" defaultValue="4 wheeler" onChange={(event)=>this.onVehicleTypeChangeHandler(event)}>
                        <option>4 wheeler</option>
                        <option>2 wheeler</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridRegNumber">
                    <Form.Label>Registration Number</Form.Label>
                    <Form.Control placeholder="Vehicle Registration Number" onChange={(event)=>this.onRegistrationChangeHandler(event)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Submit
                </Button>
            </Form>
        </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        userId: state.userId
    };
};

export default connect(mapStateToProps)(NewSlip);