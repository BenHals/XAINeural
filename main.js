let nn = null;
let overlays = {nodeImpact:false, nodeConfidence:false, excessEdges:false, nodeBounds:false};
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

    nn = new Network([2, 5, 3, 2], containerBounds);
    nn.draw();
    nn.applyOverlays(overlays);
    nn.update();
}

function update(){
    nn.applyOverlays(overlays);
    nn.update();
}

function toggleImpact(){
    overlays.nodeImpact = !overlays.nodeImpact;
    update();
}
function toggleConfidence(){
    overlays.nodeConfidence = !overlays.nodeConfidence;
    update();
}
function toggleExcess(){
    overlays.excessEdges = !overlays.excessEdges;
    update();
}
function toggleBounds(){
    overlays.nodeBounds = !overlays.nodeBounds;
    update();
}