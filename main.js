let nn = null;
let overlays = {nodeImpact:false, nodeConfidence:false, excessEdges:false, nodeBounds:false};
let input = {};


let testNets = [
    {
        jitterJSON:'{"0": {"upperBound": 0.01, "upperBoundClass": "[[0.95409715]]", "lowerBound": -0.01, "lowerBoundClass": "[[0.9571627]]"}, "1": {"upperBound": 1.01, "upperBoundClass": "[[0.95708185]]", "lowerBound": 0.99, "lowerBoundClass": "[[0.95419014]]"}}',
        backpropagateJSON:'{"2": 1.0, "0": -0.5140106105599853, "1": 0.4859894140633067}',
        confidenceJSON:'{"0": 0.9996678829193115, "1": 0.7928024530410767, "2": 0.9113708734512329}',
        excessJSON:'{"0": ["2"], "2": [], "1": ["2"]}',
        netJSON:'{"0": {"Output": 0.9998339414596558, "Weights": {"input_0": "-5.67429", "input_1": "5.7662168"}}, "1": {"Output": 0.8964012265205383, "Weights": {"input_0": "-4.97642", "input_1": "4.6954"}}, "2": {"Output": 0.9556854367256165, "Weights": {"0": "-7.433149", "1": "7.8388615"}}}',
    }
]
window.onload = function(){

    // Create SVG layer and cover full screen.
    let container = document.getElementById("main_display");
    let containerBounds = container.getBoundingClientRect();
    let w = containerBounds.width;
    let h = containerBounds.height;

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

    let inputNet = testNets[0];

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

function update(){
    nn.applyOverlays(overlays);
    nn.update();
}

function toggleImpact(){
    overlays.nodeImpact = !overlays.nodeImpact;
    if(overlays.nodeImpact){
        d3.select('.impact').classed('btn-default', false);
        d3.select('.impact').classed('btn-primary', true);
    }else{
        d3.select('.impact').classed('btn-default', true);
        d3.select('.impact').classed('btn-primary', false);
    }
    update();
}
function toggleConfidence(){
    overlays.nodeConfidence = !overlays.nodeConfidence;
    if(overlays.nodeConfidence){
        d3.select('.conf').classed('btn-default', false);
        d3.select('.conf').classed('btn-primary', true);
    }else{
        d3.select('.conf').classed('btn-default', true);
        d3.select('.conf').classed('btn-primary', false);
    }
    update();
}
function toggleExcess(){
    overlays.excessEdges = !overlays.excessEdges;
    if(overlays.excessEdges){
        d3.select('.excess').classed('btn-default', false);
        d3.select('.excess').classed('btn-primary', true);
    }else{
        d3.select('.excess').classed('btn-default', true);
        d3.select('.excess').classed('btn-primary', false);
    }
    update();
}
function toggleBounds(){
    overlays.jitter = !overlays.jitter;
    if(overlays.jitter){
        d3.select('.jitter').classed('btn-default', false);
        d3.select('.jitter').classed('btn-primary', true);
    }else{
        d3.select('.jitter').classed('btn-default', true);
        d3.select('.jitter').classed('btn-primary', false);
    }
    update();
}