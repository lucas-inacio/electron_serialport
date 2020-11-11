import React, { Component } from 'react';
import { Button, Col, Container, Row } from 'reactstrap';

import Menu from './Menu';

class Plotter extends Component {
    constructor(props) {
        super(props);
        this.serial = new Serial();
        this.state = {
            running: false
        };
    }

    componentDidMount() {
        let ctx = document.getElementById('chart').getContext('2d');
        this.plot = new SerialPlotter(ctx);

        this.plot.addPlot('data1', []);
        this.plot.setLineColor('data1', 'rgb(255, 0, 0, 0.3)')
        this.plot.setFillColor('data1', 'rgb(0, 0, 0, 0.0)')
        this.plot.addPlot('data2', []);
        this.plot.setLineColor('data2', 'rgb(0, 255, 0, 0.3)')
        this.plot.setFillColor('data2', 'rgb(0, 0, 0, 0.0)')
        this.plot.addPlot('data3', []);
        this.plot.setLineColor('data3', 'rgb(0, 0, 255, 0.3)')
        this.plot.setFillColor('data3', 'rgb(0, 0, 0, 0.0)')
        this.plot.setYLim(-0.5, 6);
        
        this.serial.setDataLayout('float', 3);
        this.serial.onData(data => {
            if (data.length === 3) {
                this.plot.pushData('data1', [data[0]]);
                this.plot.pushData('data2', [data[1]]);
                this.plot.pushData('data3', [data[2]]);
            }
        });
    }

    startAcq(port, baud) {
        this.serial.open(port, {baudRate: baud});
    }

    render() {
        return(
            <Container fluid>
                <Row>
                    <Col md="3">
                        <Menu startAcq={(port, baud) => this.startAcq(port, baud)} stopAcq={() => this.serial.close()}/>
                    </Col>
                    <Col md="9">
                        <canvas id="chart"></canvas>
                    </Col>
                </Row>
            </Container>
        );
    }
}

export default Plotter;