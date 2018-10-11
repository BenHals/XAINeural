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
        this.minJitterR = this.lb * 10;
        this.maxJitterR = this.ub * 10;
        this.mainJitterR = this.activation * 10;
        for(let e = 0; e < parentWeights.length; e++){
            this.edgeWidths.push(parentWeights[e] * parents[e].activation);
        }
        this.color = 'black';
    }

    draw(){
        return;
    }
}
class Network{
    constructor(layerSizes, containerBounds){
        this.layers = [];
        let nodeId = 0;
        let margin = containerBounds.width * 0.2;
        let layerSpacing = (containerBounds.width - margin*2) / (layerSizes.length - 1);
        for(let l = 0; l < layerSizes.length; l++){
            this.layers.push([]);
            let nodeSpacing = containerBounds.height / (layerSizes[l] + 1);
            for(let n = 0; n < layerSizes[l]; n++){
                let lastLayer = l > 0 ? this.layers[l-1] : null;
                let x = margin + l * layerSpacing;
                let y = (n+1) * nodeSpacing;
                let newNode = new Node(lastLayer, null, [], [], Math.random(), nodeId, x, y, Math.random(), Math.random(), Math.random(), Math.random());
                nodeId++;
                if(lastLayer){
                    for(let ln = 0; ln < lastLayer.length; ln++){
                        newNode.parentWeights.push(1);
                        newNode.excessEdges.push(Math.round(Math.random()));
                        if(lastLayer[ln].children == null){
                            lastLayer[ln].children = [];
                        }
                        lastLayer[ln].children.push(newNode);
                    }
                }
                this.layers[l].push(newNode);
            }
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
            .attr('r', function(d){return d.r})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .style('fill', 'black')
            .style('opacity', 1)
            .classed('main', true);
        circles.append('circle')
            .attr('r', function(d){return d.mainJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 1)
            .attr('stroke-opacity', 0)
            .style('fill', 'black')
            .style('stroke', 'black')
            .style('opacity', 0)
            .classed('valJitter', true);
        circles.append('circle')
            .attr('r', function(d){return d.maxJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 1)
            .style('fill', 'green')
            .style('stroke', 'green')
            .style('opacity', 0)
            .classed('maxJitter', true);
        circles.append('circle')
            .attr('r', function(d){return d.minJitterR})
            .attr('cx', function(d){return d.x})
            .attr('cy', function(d){return d.y})
            .attr('fill-opacity', 0)
            .attr('stroke-opacity', 1)
            .style('fill', 'red')
            .style('stroke', 'red')
            .style('opacity', 0)
            .classed('minJitter', true);

        


        
    }
    changeRand(){
        let flat = this.layers.flat();
        for(let n = 0; n < flat.length; n++){
            let node = flat[n];
            if(!node.parents) {
                node.r = Math.floor(Math.random() * Math.floor(50));
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

    applyOverlays(overlays){
        let flat = this.layers.flat();
        for(let n = 0; n < flat.length; n++){
            let node = flat[n];
            node.r = node.activation * 10;
            if(overlays.nodeImpact){
                node.r = node.nodeImpact * 10;
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
                node.edgeWidths[pw] = node.parentWeights[pw] * node.parents[pw].activation * 2;
                if(overlays.excessEdges){
                    if(node.excessEdges[pw] == 0){
                        node.edgeWidths[pw] = 0;
                    }
                }
            }


        }

    }

    update(){
        d3.select("#anim_base_layer_svg").selectAll('.main')
        .data(this.layers.flat()).transition().duration(1000)
        .attr('r', function(d){return d.r}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y}).style('fill', function(d){return d.color})
        .style('opacity', function(d){return d.mainOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.maxJitter')
        .data(this.layers.flat()).transition().duration(1000)
        .attr('r', function(d){return d.maxJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.minJitter')
        .data(this.layers.flat()).transition().duration(1000)
        .attr('r', function(d){return d.minJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 
        d3.select("#anim_base_layer_svg").selectAll('.valJitter')
        .data(this.layers.flat()).transition().duration(1000)
        .attr('r', function(d){return d.mainJitterR}).attr('cx', function(d){return d.x}).attr('cy', function(d){return d.y})
        .style('opacity', function(d){return d.jitterOpacity}); 

        let edges = this.getEdges();
        d3.select("#anim_base_layer_svg").selectAll('line')
            .data(edges).transition().duration(1000)
            .attr('x1', function(d){return d.x1}).attr('x2', function(d){return d.x2}).attr('y1', function(d){return d.y1}).attr('y2', function(d){return d.y2}).attr('stroke-width', function(d){return Math.abs(d.w)}).style('stroke', function(d){return d.w > 0 ? 'black' : 'red'});
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