


function getRadius(basedOn, minR, maxR){
    return Math.min(Math.max(Math.abs(basedOn), minR), maxR)
}
function reLu(val){
    return val > 0 ? val : 0;
}
function sigmoid(val){
    return val;
}
function softmaxGen(network){
    return function(val){
        let sumE = 0;
        for(let l = 0; l < network.layers[network.layers.length - 1].length; l++){
            let n = network.layers[network.layers.length - 1][l];
            let inpAct = 0;
            for(let p = 0; p < n.parents.length; p++){
                inpAct += n.parentWeights[p] * n.parents[p].calculatedAct, 0;
            }
            sumE += Math.exp(Math.max(inpAct, 0));
        }
        return Math.exp(Math.max(val, 0)) / sumE;
    }
}

class Node{
    constructor(parents, children, parentWeights, excessEdges, activation, name, x, y, nodeImpact, nodeConfidence, ub, lb){
        this.parents = parents;
        this.children = children;
        this.parentWeights = parentWeights;
        this.name = name;
        this.x = x;
        this.y = y;
        this.r = 5;
        this.nodeImpact = nodeImpact;
        this.nodeConfidence = nodeConfidence;
        this.ub = Math.max(ub, lb);
        this.lb = Math.min(lb, ub);
        this.excessEdges = excessEdges;
        this.activation = activation;
        this.edgeWidths = [];
        this.mainOpacity = 1;
        this.jitterOpacity = 1;
        this.minR = 2;
        this.maxR = 30;
        this.minJitterR = getRadius(this.lb * 10, this.minR, this.maxR);
        this.maxJitterR = getRadius(this.ub * 10, this.minR, this.maxR);
        this.mainJitterR = getRadius(this.activation * 10, this.minR, this.maxR);
        this.actFunc = reLu;
        for(let e = 0; e < parentWeights.length; e++){
            this.edgeWidths.push(parentWeights[e] * parents[e].activation);
        }
        this.color = 'black';

    }

    draw(){
        return;
    }
    calcAct(){
        let inpAct = 0;
        for(let p = 0; p < this.parents.length; p++){
            inpAct += this.parentWeights[p] * this.parents[p].calculatedAct;
        }
        this.calculatedAct = this.actFunc(inpAct);
    }
}
class Network{
    constructor(layerSizes, containerBounds, jitMap, bacMap, confMap, excMap, weiMap, netMap){
        this.layers = [];
        let nodeId = 0;
        let margin = containerBounds.width * 0.2;
        let layerSpacing = (containerBounds.width - margin*2) / (layerSizes.length - 1);
        let inpWeights = weiMap['input_0'].Output.replace('[', '').replace(']', '').split(' ');
        delete weiMap['input_0'];
        for(let l = 0; l < layerSizes.length; l++){
            this.layers.push([]);
            let nodeSpacing = containerBounds.height / (layerSizes[l] + 1);
            for(let n = 0; n < netMap[l].length; n++){
                let lastLayer = l > 0 ? this.layers[l-1] : null;
                let x = margin + l * layerSpacing;
                let y = (n+1) * nodeSpacing;
                let name = netMap[l][n];
                let act = name in weiMap ? parseFloat(weiMap[name].Output) : 0;
                if(l == 0){
                    act = parseFloat(inpWeights[n]);
                }
                let imp = name in bacMap ? parseFloat(bacMap[name]) : 0;
                let conf = name in confMap ? parseFloat(confMap[name]) : 0;
                let ub = Math.random();
                let lb = Math.random();
                if(l == 0){
                    ub = jitMap[n].upperBound;
                    lb = jitMap[n].lowerBound;
                }
                let newNode = new Node(lastLayer, null, [], [], act, name, x, y, imp, conf, ub, lb);

                nodeId++;
                let inpSum = 0;
                if(lastLayer){
                    
                    for(let ln = 0; ln < lastLayer.length; ln++){
                        
                        let parName = netMap[l-1][ln];
                        let ex = parName in excMap && excMap[parName].indexOf(name) != -1 ? 0 : 1;
                        newNode.parentWeights.push(parseFloat(weiMap[name].Weights[parName]));
                        newNode.excessEdges.push(ex);
                        if(lastLayer[ln].children == null){
                            lastLayer[ln].children = [];
                        }
                        lastLayer[ln].children.push(newNode);
                        inpSum += parseFloat(weiMap[name].Weights[parName]) * lastLayer[ln].activation;
                    }
                }
                console.log(inpSum);
                console.log(newNode.activation);
                if(l == 0){
                    newNode.calculatedAct = act;
                }else if(l == layerSizes.length - 1){
                    newNode.actFunc = softmaxGen(this);
                    newNode.calcAct();
                }else{
                    newNode.calcAct();
                }
                this.layers[l].push(newNode);
            }

        }
        for(let n = 0; n < this.layers[this.layers.length - 1].length; n++){
            this.layers[this.layers.length - 1][n].calcAct();
        }
        console.log(this.layers);
    }

    draw(){
        // for(let l = 0; l < this.layers.length; l++){
        //     for(let n = 0; n < this.layers[l].length; n++){
        //         this.layers[l][n].draw();
        //     }

        let edges = this.getEdges();

        d3.select("#anim_base_layer_svg").selectAll('line')
            .data(edges)
            .enter().append('line').attr('x1', function(d){return d.x1}).attr('x2', function(d){return d.x2}).attr('y1', function(d){return d.y1}).attr('y2', function(d){return d.y2}).attr('stroke-width', function(d){return d.w})
            .style('stroke', 'black').style("stroke-linecap","round");

        let circles = d3.select("#anim_base_layer_svg").selectAll('circle')
            .data(this.layers.flat())
            .enter();
        

        circles.append('circle')
            .attr('r', function(d){
                return d.mainJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 0)
            .style('fill', 'black')
            .style('stroke', 'black')
            .style('opacity', 0)
            .classed('valJitter', true);
        circles.append('circle')
            .attr('r', function(d){
                return d.maxJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 1)
            .style('fill', 'green')
            .style('stroke', 'green')
            .style('opacity', 0)
            .classed('maxJitter', true);
        circles.append('circle')
            .attr('r', function(d){
                return d.minJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 1)
            .style('fill', 'red')
            .style('stroke', 'red')
            .style('opacity', 0)
            .classed('minJitter', true);
        circles.append('circle')
            .attr('r', function(d){
                return d.r})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .style('fill', 'black')
            .style('opacity', 1)
            .classed('main', true)
            .classed('input', function(d){
                return d.name.indexOf('input') != -1});
        
        d3.selectAll('.input').call(d3.drag().on("drag", function(d, i){
            if(!overlays.calc) return;
            console.log('drag');
            console.log(d3.event.dx);
            d.calculatedAct += d3.event.dx + d3.event.dy*-1;
            console.log(d.calculatedAct);
            nn.updateCalc();
            update(0);
        }));

        let inputs = d3.select("#anim_base_layer_svg").selectAll('g')
            .data(this.layers[0])
            .enter();
        
            inputs.append('text')
            .attr('x', function(d){return d.x - 150})
            .attr('y', function(d){return d.y})
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            .text(function(d){return d.name});

            inputs.append('text')
            .attr('x', function(d){return d.x - 50})
            .attr('y', function(d){return d.y})
            .attr('text-anchor', 'end')
            .attr('alignment-baseline', 'central')
            .classed('inpVals', true)
            .text(function(d){return d.activation});

        
    }

    changeRand(){
        let flat = this.layers.flat();
        for(let n = 0; n < flat.length; n++){
            let node = flat[n];
            if(!node.parents) {
                node.r = this.getRadius(Math.floor(Math.random() * Math.floor(50)), node.minR, node.maxR);
            }else{
                let activationSum = 0;
                for(let pw = 0; pw < node.parentWeights.length; pw++){
                    node.parentWeights[pw] = Math.random() * 2 - 1;
                    activationSum += node.parentWeights[pw] * node.parents[pw].r;
                }
                node.r = Math.max(activationSum, 0);
            }
        }

    }
    updateCalc(){
        for(let l = 1; l < this.layers.length; l++){
            for(let n = 0; n < this.layers[l].length; n++){
                this.layers[l][n].calcAct();
            }
        }
    }
    applyOverlays(overlays){
        let flat = this.layers.flat();
        let normActMax = null;
        let normActMin = null;
        for(let n = 0; n < flat.length; n++){
            let a = flat[n].activation;
            if(normActMax == null || a > normActMax) normActMax = a;
            if(normActMin == null || a < normActMin) normActMin = a;
        }
        let normCActMax = null;
        let normCActMin = null;
        for(let n = 0; n < flat.length; n++){
            let a = flat[n].calculatedAct;
            if(normCActMax == null || a > normCActMax) normCActMax = a;
            if(normCActMin == null || a < normCActMin) normCActMin = a;
        }
        for(let n = 0; n < flat.length; n++){
            if(n >= flat.length - this.layers[this.layers.length - 1].length){
                normActMax = 1;
                normActMin = 0;
                normCActMax = 1;
                normCActMin = 0;
            }
            let node = flat[n];
            // node.r = getRadius(node.activation * 10, node.minR, node.maxR);
            node.r = ((node.activation - normActMin) / (normActMax - normActMin)) * (node.maxR - node.minR) + node.minR;
            if(overlays.nodeImpact){
                node.r = getRadius(node.nodeImpact * 10, node.minR, node.maxR);
            }
            if(overlays.calc){
                //node.r = getRadius(node.calculatedAct * 10, node.minR, node.maxR);
                node.r = ((node.calculatedAct - normCActMin) / (normCActMax - normCActMin)) * (node.maxR - node.minR) + node.minR;
            }
            

            node.color = 'black';
            if(overlays.nodeConfidence){
                let colScale = d3.scaleLinear()
                    .range(['red','green']);
                node.color = d3.interpolateRdYlGn(node.nodeConfidence);
            }
            
            if(overlays.jitter && n < this.layers[0].length){
                node.mainOpacity = 0;
                node.jitterOpacity = 1;
            }else{
                node.mainOpacity = 1;
                node.jitterOpacity = 0;
            }
            
            for(let pw = 0; pw < node.parentWeights.length; pw++){
                node.edgeWidths[pw] = Math.min(Math.max(Math.abs(node.parentWeights[pw] * node.parents[pw].activation * 2), 1), 5);
                if(node.parentWeights[pw] * node.parents[pw].activation * 2 < 0) node.edgeWidths[pw] *= -1;
                if(overlays.calc){
                    node.edgeWidths[pw] = Math.min(Math.max(Math.abs(node.parentWeights[pw] * node.parents[pw].calculatedAct * 2), 1), 5);
                    if(node.parentWeights[pw] * node.parents[pw].calculatedAct * 2 < 0) node.edgeWidths[pw] *= -1; 
                }
                if(overlays.excessEdges){
                    if(node.excessEdges[pw] == 0){
                        node.edgeWidths[pw] = 0;
                    }
                }
                
            }


        }

    }

    update(speed=1000){
        d3.select("#anim_base_layer_svg").selectAll('.main')
        .data(this.layers.flat()).transition().duration(speed)
        .attr('r', function(d){return d.r}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y}).style('fill', function(d){return d.color})
        .style('opacity', function(d){return d.mainOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.maxJitter')
        .data(this.layers.flat()).transition().duration(speed)
        .attr('r', function(d){return d.maxJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.minJitter')
        .data(this.layers.flat()).transition().duration(speed)
        .attr('r', function(d){return d.minJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.valJitter')
        .data(this.layers.flat()).transition().duration(speed)
        .attr('r', function(d){return d.mainJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 

        let edges = this.getEdges();
        d3.select("#anim_base_layer_svg").selectAll('line')
            .data(edges).transition().duration(speed)
            .attr('x1', function(d){return d.x1}).attr('x2', function(d){return d.x2}).attr('y1', function(d){return d.y1}).attr('y2', function(d){return d.y2}).attr('stroke-width', function(d){return Math.abs(d.w)}).style('stroke', function(d){return d.w > 0 ? 'black' : 'red'});
        
        d3.selectAll('.inpVals').text(function(d){return overlays.calc ? Math.round(d.calculatedAct * 100) /100 : Math.round(d.activation * 100) / 100})
        }
    getEdges(){
        let flat = this.layers.flat();
        let edges = [];
        for(let n = 0; n < flat.length; n++){
            let node = flat[n];
            if(!node.parents) continue;
            for(let p = 0; p < node.parents.length; p++){
                let parent = node.parents[p];
                edges.push({x1:parent.x, y1:parent.y, x2:node.x, y2:node.y, w:node.edgeWidths[p]})
            }
        }
        return edges;
    }
}