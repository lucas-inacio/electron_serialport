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
        this.plot.setLineColor('data1', 'rgb(255, 0, 0, 0.3)');
        this.plot.setFillColor('data1', 'rgb(0, 0, 0, 0.0)');
        this.plot.setYLim(-0.1, 5.0);

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
        // Cores pseudo aleatórios
        let [r, g, b] = (() => {
            let colors = [];
            for (let i = 0; i < 3; ++i)
                colors.push((Math.random() * 255 + 50) % 256);
            return colors;
        })();
        this.plot.setLineColor(label, 'rgb(' + r + ', ' + g + ', ' + b + ', 0.3)');
        this.plot.setFillColor(label, 'rgb(0, 0, 0, 0)');
    }

    clearPlot() {
        this.plot.removeAllPlots();
    }

    startAcq(port, baud, type) {
        if (port && baud && type && this.plot.getSize() > 0) {
            this.serial.setDataLayout(type, this.plot.getSize());
            this.plot.clear();
            
            return this.serial.open(port, {baudRate: baud});
        }
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