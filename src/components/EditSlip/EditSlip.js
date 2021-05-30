import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { Form, Button } from 'react-bootstrap';
import './EditSlip.css';

class EditSlip extends Component {

    state = {
        name: '',
        vehicle: '',
        vehicleType: '',
        registrationNumber: '',
        inTime: '',
        outTime: '',
        userId: ''
    };

    componentDidMount () {
        //console.log(this.props.history.location.slipId);
        axios.get(`https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip/${this.props.history.location.slipId}.json`)
        .then(res => {
            this.setState({ name: res.data.name, vehicle: res.data.vehicle, vehicleType: res.data.vehicleType, registrationNumber: res.data.registrationNumber, inTime: res.data.inTime, outTime: res.data.outTime });
            console.log(res.data);
        })
        .catch(err => {
            console.log(err);
        });
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
        this.setState({ userId: this.props.userId }, ()=>{
            axios.put(`https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip/${this.props.history.location.slipId}.json`, this.state)
            .then(res => {
                console.log(res);
                this.props.history.push('/home');
            })
            .catch(err => {
                console.log(err);
            });
        })
    };

    render(){
    return (
        <div className="formContainer">
            <Form onSubmit={this.onSubmitHandler}>
                <Form.Group controlId="formGridName">
                    <Form.Label>Name</Form.Label>
                    <Form.Control placeholder={this.state.name} onChange={(event)=>this.onNameChangeHandler(event)} />
                </Form.Group>

                <Form.Group controlId="formGridVehicle">
                    <Form.Label>Vehicle</Form.Label>
                    <Form.Control placeholder={this.state.vehicle} onChange={(event)=>this.onVehicleChangeHandler(event)} />
                </Form.Group>

                <Form.Group controlId="formGridVehicleType">
                    <Form.Label>Vehicle Type</Form.Label>
                    <Form.Control as="select" value={this.state.vehicleType} onChange={(event)=>this.onVehicleTypeChangeHandler(event)}>
                        <option>4 wheeler</option>
                        <option>2 wheeler</option>
                    </Form.Control>
                </Form.Group>

                <Form.Group controlId="formGridRegNumber">
                    <Form.Label>Registration Number</Form.Label>
                    <Form.Control placeholder={this.state.registrationNumber} onChange={(event)=>this.onRegistrationChangeHandler(event)} />
                </Form.Group>

                <Button variant="primary" type="submit">
                    Edit
                </Button>
            </Form>
        </div>
    )
    }
}

const mapStateToProps = state => {
    return {
        userId: state.userId
    };
};

export default connect(mapStateToProps)(EditSlip);