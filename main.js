let nn = null;
let overlays = {nodeImpact:false, nodeConfidence:false, excessEdges:false, nodeBounds:false};
let input = {};
let textboxStack = ["Network activation view"];

let testNets = [
    // {
    //     jitterJSON:'{"0": {"upperBound": 0.01, "upperBoundClass": "[[0.95409715]]", "lowerBound": -0.01, "lowerBoundClass": "[[0.9571627]]"}, "1": {"upperBound": 1.01, "upperBoundClass": "[[0.95708185]]", "lowerBound": 0.99, "lowerBoundClass": "[[0.95419014]]"}}',
    //     backpropagateJSON:'{"2": 1.0, "0": -0.5140106105599853, "1": 0.4859894140633067}',
    //     confidenceJSON:'{"0": 0.9996678829193115, "1": 0.7928024530410767, "2": 0.9113708734512329}',
    //     excessJSON:'{"0": ["2"], "2": [], "1": ["2"]}',
    //     netJSON:'{"0": {"Output": 0.9998339414596558, "Weights": {"input_0": "-5.67429", "input_1": "5.7662168"}}, "1": {"Output": 0.8964012265205383, "Weights": {"input_0": "-4.97642", "input_1": "4.6954"}}, "2": {"Output": 0.9556854367256165, "Weights": {"0": "-7.433149", "1": "7.8388615"}}}',
    // },
    {
        jitterJSON:'{"0": {"upperBound": 63.03, "upperBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]", "lowerBound": 63.02, "lowerBoundClass": "[[0.0000000e+00 6.3824952e-27 1.0000000e+00]]"}, "1": {"upperBound": 22.55, "upperBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]", "lowerBound": 22.54, "lowerBoundClass": "[[0.0000000e+00 6.2596194e-27 1.0000000e+00]]"}, "2": {"upperBound": 39.61, "upperBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]", "lowerBound": 39.6, "lowerBoundClass": "[[0.0000000e+006.3869765e-27 1.0000000e+00]]"}, "3": {"upperBound": 40.48, "upperBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]", "lowerBound": 40.47, "lowerBoundClass": "[[0.0000000e+00 6.3685835e-27 1.0000000e+00]]"}, "4": {"upperBound": 98.67, "upperBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]", "lowerBound": 98.66, "lowerBoundClass": "[[0.000000e+00 6.363047e-27 1.000000e+00]]"}, "5": {"upperBound": -0.24, "upperBoundClass": "[[0.0000000e+00 6.1752336e-27 1.0000000e+00]]", "lowerBound": -0.25, "lowerBoundClass": "[[0.0000000e+00 6.3491297e-27 1.0000000e+00]]"}}',
        backpropagateJSON:'{"8": 1.0, "0": -0.0, "1": -0.0, "2": -0.06550623929853402, "3": 0.0, "4": 0.0, "5": 0.93449373306136}',
        confidenceJSON:'{"0": 1.0, "1": 1.0, "2": 40.72028350830078, "3": 1.0, "4": 1.0, "5": 290.1731262207031, "6": 1.0, "7": 1.0, "8": 1.0}',
        excessJSON:'{"0": ["6", "7", "8"], "6": [], "7": [], "8": [], "1": ["6", "7", "8"], "2": ["6", "7", "8"], "3": ["6", "7", "8"], "4": ["6", "7", "8"], "5": ["6", "7", "8"]}',
        netJSON:'{"0": {"Output": "0.0", "Weights": {"input_0": "-0.48120344", "input_1": "0.45962825", "input_2": "-0.94553465", "input_3": "-0.69172037", "input_4": "-0.026155187", "input_5": "-0.39313844"}}, "1": {"Output": "0.0", "Weights": {"input_0": "-0.15540352", "input_1": "-0.7104605", "input_2": "0.7388292", "input_3": "0.13011326", "input_4": "-0.41468304", "input_5": "-2.21787"}}, "2": {"Output": "20.860142", "Weights": {"input_0": "-0.17232077", "input_1": "0.28391224", "input_2": "-0.042219244", "input_3": "0.462", "input_4": "0.07464383", "input_5": "-1.7533373"}}, "3": {"Output": "0.0", "Weights": {"input_0": "-0.7920705", "input_1": "0.06908517", "input_2": "0.52404803", "input_3": "0.26844874", "input_4": "-1.1732131", "input_5": "1.4207795"}}, "4": {"Output": "0.0", "Weights": {"input_0": "-0.17213967", "input_1": "0.42106122", "input_2": "0.3482016", "input_3": "0.17259923", "input_4": "-1.4283476", "input_5": "-1.5388545"}}, "5": {"Output": "145.58656", "Weights": {"input_0": "0.3538581", "input_1": "-1.454249", "input_2":"0.81097835", "input_3": "1.7124891", "input_4": "0.53963804", "input_5": "-0.36790875"}}, "6": {"Output": "0.0", "Weights": {"0": "1.308989", "1": "0.6373214", "2": "0.31363624", "3": "-0.39611858", "4": "0.9724378", "5": "-1.6847507"}}, "7": {"Output": "6.3491297e-27", "Weights": {"0": "0.7110711", "1": "0.6805154", "2": "1.2342358", "3": "-0.37033927", "4": "-0.36369237", "5": "0.34879026"}}, "8": {"Output": "1.0", "Weights": {"0": "-1.1187962", "1": "-2.3506296", "2": "-0.48486108", "3": "1.403186", "4": "0.43920487", "5": "0.9910761"}}, "input_0": {"Output": "[63.03 22.55 39.61 40.48 98.67 -0.25]"}}',
    },
    {
        jitterJSON:'{"0": {"upperBound": 1.0009767471984032, "upperBoundClass": "1", "lowerBound": -0.879023252801598, "lowerBoundClass": "1"}, "1": {"upperBound": -0.6388344185289954, "upperBoundClass": "0", "lowerBound": -0.6788344185289954, "lowerBoundClass": "1"}, "2": {"upperBound": 1.0042551939967768, "upperBoundClass": "1", "lowerBound": -1.2357448060032248, "lowerBoundClass": "1"}, "3": {"upperBound": 1.007373294032125, "upperBoundClass": "1", "lowerBound": -0.6226267059678761, "lowerBoundClass": "1"}, "4": {"upperBound": 1.0010723581754022, "upperBoundClass": "1", "lowerBound": -0.048927641824598585, "lowerBoundClass": "1"}, "5": {"upperBound": -0.10609233063296211, "upperBoundClass": "2", "lowerBound": -0.9860923306329629, "lowerBoundClass": "1"}}',
        backpropagateJSON:'{"8": 1.0, "0": -0.13314239913722037, "1": -0.6789555022256386, "2": -0.09700284950765549, "3": 0.0, "4": 0.06652744725571547, "5": 0.02437179136423744}',
        confidenceJSON:'{"0": 1.3019795417785645, "1": 4.587186813354492, "2": 2.869931221008301, "3": 1.0, "4": 1.9300146102905273, "5": 0.5243182182312012, "6": 0.06127661466598511, "7": 0.06122314929962158, "8": 0.999946617281239}',
        excessJSON:'{"2": ["6", "7", "8"], "6": [], "7": [], "8": [], "3": ["6", "7", "8"], "5": ["6", "7", "8"]}',
        netJSON:'{"0": {"Output": "1.1509898", "Weights": {"input_0": "-0.48120344", "input_1": "0.45962825", "input_2": "-0.94553465", "input_3": "-0.69172037", "input_4": "-0.026155187", "input_5": "-0.39313844"}}, "1": {"Output": "2.7935934", "Weights": {"input_0": "-0.15540352", "input_1": "-0.7104605", "input_2": "0.7388292", "input_3": "0.13011326", "input_4": "-0.41468304", "input_5": "-2.21787"}}, "2": {"Output": "1.9349656", "Weights": {"input_0": "-0.17232077", "input_1": "0.28391224", "input_2": "-0.042219244", "input_3":"0.462", "input_4": "0.07464383", "input_5": "-1.7533373"}}, "3": {"Output": "0.0", "Weights": {"input_0": "-0.7920705", "input_1": "0.06908517", "input_2": "0.52404803", "input_3": "0.26844874", "input_4": "-1.1732131", "input_5": "1.4207795"}}, "4": {"Output": "1.4650073", "Weights": {"input_0": "-0.17213967", "input_1": "0.42106122", "input_2": "0.3482016", "input_3": "0.17259923", "input_4": "-1.4283476", "input_5": "-1.5388545"}}, "5": {"Output": "0.23784089", "Weights": {"input_0": "0.3538581", "input_1": "-1.454249", "input_2": "0.81097835", "input_3": "1.7124891", "input_4": "0.53963804", "input_5": "-0.36790875"}}, "6": {"Output": "0.4693617", "Weights": {"0": "1.308989", "1": "0.6373214", "2": "0.31363624", "3": "-0.39611858", "4": "0.9724378", "5": "-1.6847507"}}, "7": {"Output": "0.5306116", "Weights": {"0": "0.7110711", "1": "0.6805154", "2": "1.2342358", "3": "-0.37033927", "4": "-0.36369237", "5": "0.34879026"}}, "8": {"Output": "2.669136e-05", "Weights": {"0": "-1.1187962", "1": "-2.3506296", "2": "-0.48486108","3": "1.403186", "4": "0.43920487", "5": "0.9910761"}}, "input_0": {"Output": "[-0.87902325 -0.67883442 -1.23574481 -0.62262671 -0.04892764 -0.98609233]"}}',
    },
]
window.onload = function(){
    let s = '1';
    for(let o in testNets){

        let op = d3.select('#inputSelect').append('option').text(o).attr('value', o);
        if(s == o){
            op.property('selected', true);
        }
    }
    startVis(testNets[1]);

}
function selectInput(){
    let t = document.getElementById("inputSelect").value;
    console.log(t);
    startVis(testNets[t]);
}
function startVis(inp){
    // Create SVG layer and cover full screen.
    let container = document.getElementById("main_display");
    let containerBounds = container.getBoundingClientRect();
    let w = containerBounds.width;
    let h = containerBounds.height;

    d3.select('#anim_base_layer_svg').selectAll('*').remove();
    d3.select('#anim_dynamic_layer_canvas').remove();

    let base_layer_svg = document.getElementById("anim_base_layer_svg");
    base_layer_svg.setAttribute("id","anim_base_layer_svg");
    base_layer_svg.setAttribute("width", w);
    base_layer_svg.setAttribute("height", h);
    base_layer_svg.style.position = "absolute";
    base_layer_svg.style.width = `${w}px`;
    base_layer_svg.style.height = `${h}px`;

    let dynamic_layer_canvas = document.createElement("canvas");
    dynamic_layer_canvas.setAttribute("id","anim_dynamic_layer_canvas");
    dynamic_layer_canvas.setAttribute("width", w);
    dynamic_layer_canvas.setAttribute("height", h);
    dynamic_layer_canvas.style.position = "absolute";

    container.appendChild(base_layer_svg);
    //container.appendChild(dynamic_layer_canvas);

    let inputNet = inp;

    let retVal = parseNetJSON(inputNet.jitterJSON, inputNet.backpropagateJSON, inputNet.confidenceJSON, inputNet.excessJSON, inputNet.netJSON);
    let netMap = retVal[0];
    let lSizes = retVal[1];

    nn = new Network(lSizes, containerBounds, JSON.parse(inputNet.jitterJSON), JSON.parse(inputNet.backpropagateJSON), JSON.parse(inputNet.confidenceJSON), JSON.parse(inputNet.excessJSON), JSON.parse(inputNet.netJSON), netMap);
    nn.draw();
    nn.applyOverlays(overlays);
    nn.update();
}

function parseNetJSON(j, b, v, e, n){
    let net = JSON.parse(n);
    let jitter = JSON.parse(j);
    let lSizes = [];
    let netLayers = [];

    // Number of inputs
    
    netLayers.push([]);
    for(let k in Object.keys(jitter)){
        netLayers[0].push("input_" + k);
    }
    for(let nName in Object.keys(net)){
        if(Object.keys(net)[nName].indexOf('input') != -1) continue;
        let layerIndexOfParent = 0;
        for(let l in netLayers){
            if(netLayers[l].indexOf(Object.keys(net[nName].Weights)[0]) != -1){
                break;
            }
            layerIndexOfParent++;
        }
        layerIndexOfNode = layerIndexOfParent + 1;
        if(layerIndexOfNode >= netLayers.length){
            netLayers.push([]);
        }
        netLayers[layerIndexOfNode].push(nName);
    }
    for(let l in netLayers){
        lSizes.push(netLayers[l].length);
    }
    console.log(netLayers);
    console.log(lSizes);
    return [netLayers, lSizes];
}

function update(speed=1000){
    nn.applyOverlays(overlays);
    nn.update(speed);
}

function toggleImpact(){
    overlays.nodeImpact = !overlays.nodeImpact;
    if(overlays.nodeImpact){
        textboxStack.push("Node size indicates their impact on classification");
        
        d3.select('.impact').classed('btn-default', false);
        d3.select('.impact').classed('btn-primary', true);
    }else{
        textboxStack.pop();
        d3.select('.impact').classed('btn-default', true);
        d3.select('.impact').classed('btn-primary', false);
    }
    d3.select("#info").text(textboxStack[textboxStack.length-1]);
    update();
}
function toggleConfidence(){
    overlays.nodeConfidence = !overlays.nodeConfidence;
    if(overlays.nodeConfidence){
        textboxStack.push("Node color indicates their stability");
        d3.select('.conf').classed('btn-default', false);
        d3.select('.conf').classed('btn-primary', true);
    }else{
        textboxStack.pop();
        d3.select('.conf').classed('btn-default', true);
        d3.select('.conf').classed('btn-primary', false);
    }
    d3.select("#info").text(textboxStack[textboxStack.length-1]);
    update();
}
function toggleExcess(){
    overlays.excessEdges = !overlays.excessEdges;
    if(overlays.excessEdges){
        textboxStack.push("Non-important edges are removed");
        d3.select('.excess').classed('btn-default', false);
        d3.select('.excess').classed('btn-primary', true);
    }else{
        textboxStack.pop();
        d3.select('.excess').classed('btn-default', true);
        d3.select('.excess').classed('btn-primary', false);
    }
    d3.select("#info").text(textboxStack[textboxStack.length-1]);
    update();
}
function toggleBounds(){
    overlays.jitter = !overlays.jitter;
    if(overlays.jitter){
        textboxStack.push("Input bounds before a class change occurs");
        d3.select('.jitter').classed('btn-default', false);
        d3.select('.jitter').classed('btn-primary', true);
    }else{
        textboxStack.pop();
        d3.select('.jitter').classed('btn-default', true);
        d3.select('.jitter').classed('btn-primary', false);
    }
    d3.select("#info").text(textboxStack[textboxStack.length-1]);
    update();
}
function toggleCalc(){
    overlays.calc = !overlays.calc;
    if(overlays.calc){
        textboxStack.push("Drag an input to change it");
        d3.select('.calc').classed('btn-default', false);
        d3.select('.calc').classed('btn-primary', true);
    }else{
        textboxStack.pop();
        d3.select('.calc').classed('btn-default', true);
        d3.select('.calc').classed('btn-primary', false);
    }
    d3.select("#info").text(textboxStack[textboxStack.length-1]);
    nn.updateCalc();
    update();
}

function updateCalc(){
    for(let n = 0; n < nn.layers[0].length; n++){
        nn.layers[0][n].calculatedAct = nn.layers[0][n].activation * Math.random();
    }
    
    nn.updateCalc();
    update();
}