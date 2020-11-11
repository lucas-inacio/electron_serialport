// class MultiPlot {
//     constructor(p5Instance, start, end, pointCount=200) {
//         this.start = start || 0;
//         this.end = end || 5;
//         this.pointCount = pointCount;
//         this.plots = {};
//         this.plot = new GPlot(p5Instance);
//     }

//     addCurve(name) {
//         let points = [];
//         this.plots[name] = [];
//         for (let i = 0; i < this.pointCount; ++i) {
//             this.plots[name].push(0);
//             points.push(new GPoint(i, 0));
//         }
//         this.plot.addLayer(name, points);
//     }

//     addPoints(name, points) {
//         if (this.pointCount > points.length) {
//             let start = points.length;
//             let newPoints = [];
//             for (let i = start; i < this.pointCount; ++i) {
//                 newPoints.push(this.plots[name][i]);
//             }
//             for (let j = 0; j < points.length; ++j) {
//                 newPoints.push(points[j]);
//             }
//             this.plots[name] = newPoints;
//         } else {
//             let diff = points.length - this.pointCount;
//             if (diff > 0) {
//                 this.plots[name] = points.slice(diff);
//             } else {
//                 this.plots[name] = points.slice(0);
//             }
//         }
//         this.generate(name);
//     }

//     generate(name) {
//         let points = [];
//         for (let i = 0; i < this.pointCount; ++i) {
//             points.push(new GPoint(i, this.plots[name][i]));
//         }
//         this.plot.setPoints(points, name);
//     }

//     draw() {
//         this.plot.beginDraw();
//         this.plot.drawBackground();
//         this.plot.drawBox();
//         this.plot.drawXAxis();
//         this.plot.drawYAxis();
//         this.plot.drawTitle();
//         this.plot.drawLines();
//         // this.plot.drawPoints();
//         this.plot.endDraw();
//     }

//     getPlot() {
//         return this.plot;
//     }
// }

class Plotter {
    constructor(canvasContext, pointCount) {
        this.pointCount = pointCount || 200;
        this.data = {};
        this.chart = new Chart(canvasContext, {
            type: 'line',
            data: {
                datasets: []
            },
            options: {
                scales: {
                    xAxes: [{
                        display: false,
                        type: 'linear',
                        ticks: {
                           max: this.pointCount,
                           min: 0,
                           stepSize: 1,
                        }
                    }],
                    yAxes: [{
                        ticks: {
                            min: 0,
                            max: 1
                        }
                    }]
                }
            }
        });
    }

    addPlot(label, data) {
        let points = [];
        for (let i = 0; i < data.length; ++i) {
            points.push({x: i, y: data[i]});
        }
        this.data[label] = points;
        this.chart.data.datasets.push({label, data: points});
        this.chart.update();
    }

    pushData(label, data) {
        this.data[label].push(...data);
        let newPoints = [];
        // Remove os dados anteriores
        if (this.data[label].length > this.pointCount) {
            let diff = this.data[label].length - this.pointCount;
            this.data[label].splice(0, diff);
        }

        // Remapeia os índices entre 0 e 199
        for (let i = 0; i < this.data[label].length - data.length; ++i) {
            newPoints.push({x: i, y: this.data[label][i].y});
        }
        for (let i = this.data[label].length - data.length; i < this.data[label].length; ++i) {
            newPoints.push({x: i, y: this.data[label][i]});
        }
        
        for (let key in this.chart.data.datasets) {
            if (this.chart.data.datasets[key].label === label) {
                this.chart.data.datasets[key].data = newPoints;
                break;
            }
        }
        this.data[label] = newPoints;
        this.chart.update();
    }

    // color deve ser uma string na forma 'rgb(r, g, b, a)'
    setLineColor(label, color) {
        for (let key in this.chart.data.datasets) {
            if (this.chart.data.datasets[key].label === label) {
                this.chart.data.datasets[key].borderColor = color;
                break;
            }
        }
    }

    setFillColor(label, color) {
        for (let key in this.chart.data.datasets) {
            if (this.chart.data.datasets[key].label === label) {
                this.chart.data.datasets[key].backgroundColor = color;
                break;
            }
        }
    }

    setXLim(min, max) {
        this.chart.options.scales.xAxes[0].ticks.min = min;
        this.chart.options.scales.xAxes[0].ticks.max = max;
        this.chart.update();
    }

    setYLim(min, max) {
        this.chart.options.scales.yAxes[0].ticks.min = min;
        this.chart.options.scales.yAxes[0].ticks.max = max;
        this.chart.update();
    }
}