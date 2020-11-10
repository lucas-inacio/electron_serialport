class SimpleCurve {
    constructor(p5Instance, func, start, end, pointCount) {
        this.func = func; // Função de uma variável usada para calcular os valores
        this.pointCount = pointCount || 200; // Define quantos pontos são calculados para a curva
        
        this.plot = new GPlot(p5Instance);
        this.start = start || 0;
        this.end = end || 5;
        this.generate(start, end); // Utiliza a função fornecida para gerar os pontos
    }

    draw() {
        this.plot.beginDraw();
        this.plot.drawBackground();
        this.plot.drawBox();
        this.plot.drawXAxis();
        this.plot.drawYAxis();
        this.plot.drawTitle();
        this.plot.drawLines();
        // this.plot.drawPoints();
        this.plot.endDraw();
    }

    generate() {
        // Calcula pointCounts pontos dentro do intervalo entre start e end
        // Utiliza a função fornecida para encontrar os valores em y
        this.points = [];
        let step = (this.end - this.start) / this.pointCount;
        for (let i = this.start; i < this.end; i += step)
        // for (let i = this.start; i < this.end; i++)
            this.points.push(new GPoint(i, this.func(i))); // (i, func(i)) | start <= i <= end
        this.plot.setPoints(this.points);
    }

    getPlot() {
        return this.plot;
    }
}

class MultiPlot {
    constructor(p5Instance, start, end, pointCount=200) {
        this.start = start || 0;
        this.end = end || 5;
        this.pointCount = pointCount;
        this.plots = {};
        this.plot = new GPlot(p5Instance);
    }

    addCurve(name) {
        let points = [];
        this.plots[name] = [];
        for (let i = 0; i < this.pointCount; ++i) {
            this.plots[name].push(0);
            points.push(new GPoint(i, 0));
        }
        this.plot.addLayer(name, points);
    }

    addPoints(name, points) {
        if (this.pointCount > points.length) {
            let start = points.length;
            let newPoints = [];
            for (let i = start; i < this.pointCount; ++i) {
                newPoints.push(this.plots[name][i]);
            }
            for (let j = 0; j < points.length; ++j) {
                newPoints.push(points[j]);
            }
            this.plots[name] = newPoints;
        } else {
            let diff = points.length - this.pointCount;
            if (diff > 0) {
                this.plots[name] = points.slice(diff);
            } else {
                this.plots[name] = points.slice(0);
            }
        }
        this.generate(name);
    }

    generate(name) {
        let points = [];
        for (let i = 0; i < this.pointCount; ++i) {
            points.push(new GPoint(i, this.plots[name][i]));
        }
        this.plot.setPoints(points, name);
    }

    draw() {
        this.plot.beginDraw();
        this.plot.drawBackground();
        this.plot.drawBox();
        this.plot.drawXAxis();
        this.plot.drawYAxis();
        this.plot.drawTitle();
        this.plot.drawLines();
        // this.plot.drawPoints();
        this.plot.endDraw();
    }

    getPlot() {
        return this.plot;
    }
}