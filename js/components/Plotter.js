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
        this.plot.setYLim(-0.1, 5.0);
        // this.plot.addPlot('data2', []);
        // this.plot.setLineColor('data2', 'rgb(0, 255, 0, 0.3)')
        // this.plot.setFillColor('data2', 'rgb(0, 0, 0, 0.0)')
        // this.plot.addPlot('data3', []);
        // this.plot.setLineColor('data3', 'rgb(0, 0, 255, 0.3)')
        // this.plot.setFillColor('data3', 'rgb(0, 0, 0, 0.0)')
        
        // this.serial.setDataLayout('float', 1);
        this.serial.onData(data => {
            if (data.length === this.plot.getSize()) {
                for (let i = 0; i < this.plot.getSize(); ++i) {
                    this.plot.pushData('data' + (i + 1), [data[i]]);
                }
            }
        });
    }

    addPlot() {
        let index = this.plot.getSize() + 1;
        let label = 'data' + index;
        this.plot.addPlot(label, []);
        this.plot.setFillColor(label, 'rgb(0, 0, 0, 0)');
    }

    clearPlot() {
        this.plot.removeAllPlots();
    }

    startAcq(port, baud, type) {
        if (port && baud && type && this.plot.getSize() > 0) {
            this.serial.setDataLayout(type, this.plot.getSize());
            this.plot.clear();
            this.serial.open(port, {baudRate: baud});
            return true;
        }
        return false;
    }

    render() {
        return(
            <Container fluid>
                <Row>
                    <Col md="3">
                        <Menu startAcq={(port, baud, type) => this.startAcq(port, baud, type)}
                            stopAcq={() => this.serial.close()}
                            addPlot={() => this.addPlot()}
                            clearPlot={() => this.clearPlot()} />
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