import React, { Component } from 'react'
import { Image } from 'react-bootstrap';
import './Home.css';
import img from '../../assets/images/parking.png';

class Home extends Component {
    render(){
    return (
        <div className="img-container">
            <Image src={img} fluid />
        </div>
    )
}
}

export default Home;