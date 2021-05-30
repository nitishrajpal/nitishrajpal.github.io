import React, { Component } from 'react'
import axios from 'axios';
import { connect } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { Table, Button } from 'react-bootstrap';
import Spinner from '../UI/Spinner/Spinner';
import ErrorModal from '../UI/ErrorModal/ErrorModal';
import './Dashboard.css';

class Dashboard extends Component  {

    state = {
        parkingSlips: [],
        isLoading: false,
        error: ''
    }

    componentDidMount () {
        this.setState({ isLoading: true });
        const fetchedSlips = [];
        const queryParams = '?auth=' + this.props.token + '&orderBy="userId"&equalTo="' + this.props.userId + '"';
        //console.log(queryParams);
        axios.get('https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip.json' + queryParams)
        .then(res => {
            for(let key in res.data){
                fetchedSlips.push({
                    ...res.data[key],
                    id: key
                });
            }
            this.setState({ parkingSlips: fetchedSlips, isLoading: false });
            console.log(this.state.parkingSlips);
        })
        .catch(err => {
            this.setState({ error: 'Something went wrong. Please try again!' });
        });
    }

    clearErrorHandler = () => {
        this.setState({ error: '' });
    };

    onDeleteHandler = (id) => {
        //console.log(id);
        axios.delete(`https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip/${id}.json`)
        .then(res=>{
            console.log(res);
            const filteredSlips = this.state.parkingSlips.filter( item =>  item.id !== id  );
            this.setState({ parkingSlips: filteredSlips });
        })
        .catch(err=>{
            this.setState({ error: 'Something went wrong. Please try again!' });
        });
    };

    onCheckoutHandler = (id) => {
        //console.log(id);
        var nowTime = new Date().toLocaleString();
        let updatedParkingSlip = null;
        this.state.parkingSlips.map(slip => {
            if(slip.id === id){
                if(slip.outTime === ''){
                updatedParkingSlip = {...slip, outTime: nowTime };
                axios.put(`https://parking-system-a0abc-default-rtdb.firebaseio.com/parkingSlip/${id}.json`, updatedParkingSlip)
                .then(res=>{
                    console.log(res);
                })
                .catch(err=>{
                    this.setState({ error: 'Something went wrong. Please try again!' });
                })
            }
        }
            return updatedParkingSlip;
        });
        this.setState(state => ({
            ...state,
            parkingSlips: state.parkingSlips.map( slip => {
                if( slip.id === id){
                    return {
                        ...slip,
                        outTime: nowTime
                    }
                }
                else{
                    return slip;
                }
            })
        }));
    };

    render(){
        let dashboardBody = <Spinner />;
        if(!this.state.isLoading){
            dashboardBody = (
                <Table striped bordered hover variant="dark" responsive>
                <thead>
                    <tr>
                    <th>Slip number</th>
                    <th>Name</th>
                    <th>Vehicle</th>
                    <th>Vehicle Type</th>
                    <th>Reg number</th>
                    <th>In Time</th>
                    <th>Out Time</th>
                    <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {this.state.parkingSlips.map( slip => (
                        <tr key={slip.id}>
                            <td><NavLink to={{ pathname: '/editSlip', slipId: slip.id }}>{slip.id}</NavLink></td>
                            <td>{slip.name}</td>
                            <td>{slip.vehicle}</td>
                            <td>{slip.vehicleType}</td>
                            <td>{slip.registrationNumber}</td>
                            <td>{slip.inTime}</td>
                            <td>{slip.outTime}</td>
                            <td>
                                <Button id="deleteSlip" variant="danger" onClick={()=>this.onDeleteHandler(slip.id)}>Delete</Button>
                                <Button id="checkoutSlip" variant="primary" onClick={()=>this.onCheckoutHandler(slip.id)}>Checkout</Button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </Table>
            );
        }
    return (
        <>
        {/* <NavLink to="/newSlip">Generate New Slip</NavLink> */}
        <div className="dashboardContainer">
            {this.state.error ? <ErrorModal onClose={this.clearErrorHandler}>{this.state.error}</ErrorModal> : null}
            {dashboardBody}
        </div>
        </>
    )
    }
}

const mapStateToProps = state => {
    return {
        token: state.token,
        userId: state.userId
    };
};

export default connect(mapStateToProps)(Dashboard);