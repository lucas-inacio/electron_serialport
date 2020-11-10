let sine = function (p) {
    let width = p.windowWidth;
    let height = 720;
    const yMax = 7;
    let lastTimestamp = 0;
    let curve;
    let params = {
        a : 0.5,
        aMin: 0.0,
        aMax: 1,
        aStep: 0.1,
        b: 0.3,
        bMin: 0.0,
        bMax: 6,
        bStep: 0.1
    };
    // let gui;

    p.setup = function () {
        p.frameRate(24);
        p.createCanvas(width, height);
        lastTimestamp = p.millis();

        // gui = p.createGui(this, 'Função exponencial complexa');
        // gui.addObject(params);

        curve = new MultiPlot(p);
        curve.getPlot().setYLim(0, 5);
        curve.getPlot().setDim([500, 500]);
        curve.addCurve('linha1');
        curve.getPlot().getLayer('linha1').setLineColor(p.color(255, 0, 0));
        curve.addCurve('linha2');
        curve.getPlot().getLayer('linha2').setLineColor(p.color(0, 255, 0));
        curve.addCurve('linha3');
        curve.getPlot().getLayer('linha3').setLineColor(p.color(0, 0, 255));
        window.curve = curve;
    }
    
    p.draw = function () {
        p.background(255);
        
        // Confere o tempo transcorrido desde o último quadro
        let now = p.millis();
        let delta = now - lastTimestamp;
        lastTimestamp = now;

        curve.draw();
    }
}

let myp5_1 = new p5(sine);