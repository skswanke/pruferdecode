var width = window.innerWidth,
    height = 500;

var fill = d3.scale.category20();

var force = d3.layout.force()
    .size([width, height])
    .nodes([])
    .linkDistance(30)
    .charge(-60)
    .on("tick", tick);

var svg = d3.select("body").append("svg")
    .attr("width", width)
    .attr("height", height)

svg.append("rect")
    .attr("width", width)
    .attr("height", height)
    .style("fill", "none")

var nodes = force.nodes(),
    links = force.links(),
    node = svg.selectAll(".node"),
    link = svg.selectAll(".link");

restart();

Array.prototype.diff = function(a) {
    return this.filter(function(i) {return a.indexOf(i) < 0;});
};

function hideInstructions() {
    document.getElementById("info").classList.add("hide")
}

function prufer() {
    hideInstructions()
    // Parse input
    if(document.getElementById("error").classList.contains("show")){
        document.getElementById("error").classList.remove("show")
    }
    var input = document.getElementById("code").value
    var inputsplit = input.split("")
    var code = []
    var isZero = false
    var tooBig = false
    for(var j = 0; j<inputsplit.length; j++){
        var temp = parseInt(inputsplit[j])
        if(temp == 0) {
            isZero = true
        }
        if(temp >inputsplit.length + 2){
            tooBig = true
        }
        code.push(temp)
    }
    if (input === "" || input === null || input === 'undefined' || isNaN(input) || isZero || tooBig){
        console.log("invalid input")
        var error = document.getElementById("error")
        error.classList.add("show")
        if (input === "" || input === null || input === 'undefined'){
            error.textContent = "Error: Code must not be empty."
        } else if (isNaN(input)) {
            error.textContent = "Error: Code must be a number."
        } else if (isZero) {
            error.textContent = "Error: Code must not contain 0."
        } else if (tooBig) {
            error.textContent = "Error: Code must not contain a number larger than the length of the code + 2 (i.e \"1234\" each must be <= 6)."
        } else {
            error.textContent = "Error: Not sure what you did, but don't do it again."
        }
        return 0
    }
    console.log("code:")
    console.log(code.toString())

    // Remove existing nodes/links
    var nodes = []
    var links = []
    force.nodes(nodes)
    force.links(links)
    var nodes = force.nodes(),
        links = force.links()

    var verts = []
    var edges = []
    for(var i=0;i<(input.length+2);i++){
        verts.push(i+1)
    }
    var vertsLeft = verts
    console.log("vertsLeft:")
    console.log(vertsLeft.toString())

    while(vertsLeft.length>0){
        while(code.length>0){
            // Get vertices not in prufer code but are in the set of vertices
            possibleMins = vertsLeft.diff(code)
            console.log("possibleMins:")
            console.log(possibleMins.toString())

            // Get the minimum of these vertices
            minVert = Math.min.apply(Math, possibleMins)

            // Create Nodes for prufer vertex and minimum vertex
            // TODO: Make sure this connects existing nodes
            var isCodeInNodes = false
            var codeNodeLoc = -1
            for (var k=0; k < nodes.length; k++) {
                if (nodes[k].id == code[0].toString()) {
                    isCodeInNodes = true
                    codeNodeLoc = k
                    break
                }
            }
            console.log("Is " + code[0].toString() + " in nodes: " + isCodeInNodes.toString())
            if(!isCodeInNodes){
                sourceNode = {id: code[0].toString()}
                nodes.push(sourceNode)
                codeNodeLoc = nodes.length - 1 
                console.log("Code node adds:")
                console.log(sourceNode.id)
            }
            var isMinInNodes = false
            var minNodeLoc = -1
            for (var k=0; k < nodes.length; k++) {
                if (nodes[k].id == minVert.toString()) {
                    isMinInNodes = true
                    minNodeLoc = k
                    break
                }
            }
            console.log("Is " + minVert.toString() + " in nodes: " + isMinInNodes.toString())
            if(!isMinInNodes){
                targetNode = {id: minVert.toString()}
                nodes.push(targetNode)
                minNodeLoc = nodes.length - 1
                console.log("Min node adds:")
                console.log(targetNode.id)
            }

            // Create an Edge between the vertices
            links.push({source: nodes[codeNodeLoc], target: nodes[minNodeLoc]})
            console.log("Links Add:")
            console.log("source:") 
            console.log(sourceNode)
            console.log("target:")
            console.log(targetNode)

            // Remove vertex from prufer code
            code.shift()
            console.log("code:")
            console.log(code.toString())

            // Remove min vertex from remain vertices
            vertsLeft.splice(vertsLeft.indexOf(minVert), 1)
            console.log("vertsLeft:")
            console.log(vertsLeft.toString())
            console.log("Nodes:")
            for(var j=0; j<nodes.length;j++){
                console.log(nodes[j])
            }
            console.log("--------------------------------------------------------")
            // Restart force layout
            restart()
        }
        console.log("Verts Left: " + vertsLeft.toString())

        //Connect final remaining vertices in remaining vertices
        var is0InNodes = false
        var is1InNodes = false
        var zeroLoc = 0
        var oneLoc = 0
        for (var k=0; k < nodes.length; k++) {
            if (nodes[k].id == vertsLeft[0].toString()) {
                is0InNodes = true
                zeroLoc = k
            }
            if (nodes[k].id == vertsLeft[1].toString()) {
                is1InNodes = true
                oneLoc = k
            }
        }
        if(is0InNodes && !is1InNodes){
            targetNode = {id: vertsLeft[1].toString()}
            nodes.push(targetNode)
            links.push({source: nodes[zeroLoc], target: nodes[nodes.length-1]})
            console.log("Final Add:")
            console.log(nodes[nodes.length-1].id)
            console.log("Final Links Add:")
            console.log("source:") 
            console.log(nodes[zeroLoc])
            console.log("target:")
            console.log(nodes[nodes.length-1])
        } else if (is1InNodes && !is0InNodes) {
            targetNode = {id: vertsLeft[0].toString()}
            nodes.push(targetNode)
            links.push({source: nodes[oneLoc], target: nodes[nodes.length-1]})
            console.log("Final Add:")
            console.log(targetNode.id)
            console.log("Final Links Add:")
            console.log("source:") 
            console.log(nodes[zeroLoc])
            console.log("target:")
            console.log(nodes[nodes.length-1])
        } else if (is0InNodes && is1InNodes) {
            links.push({source: nodes[oneLoc], target: nodes[zeroLoc]})
        }
        vertsLeft = []

        restart()
        console.log("Nodes:")
        console.log(nodes)
    }
}

// Copy/Pasted from D3 samples
function tick() {
  link.attr("x1", function(d) { return d.source.x; })
      .attr("y1", function(d) { return d.source.y; })
      .attr("x2", function(d) { return d.target.x; })
      .attr("y2", function(d) { return d.target.y; })

  node.attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
}

// Copy/Pasted with a little modification.
function restart() {
    link = link.data(force.links(), function(d) { return d.source.id + "-" + d.target.id; })
    link.enter().insert("line", ".node").attr("class", "link")
    link.exit().remove()

    node = node.data(force.nodes(), function(d) { return d.id;})
//     node.enter().append("g").attr("class", "node").call(force.drag)
    node.enter().append("g")
        .attr("class", function(d) { return "node " + d.id; })
        .attr("transform", function(d){return "translate("+d.x+","+d.y+")"})
    
    node.append("circle")
        .attr("r", 8)
        .call(force.drag)
    
    node.append("text")
        .attr("text-anchor", "middle")
        .attr("dx", 12)
        .attr("dy", ".35em")
        .text(function(d) { return d.id })
//     node.append("text").attr("dx", 12).attr("dy", ".35em").text(function(d) { return d.id })
    node.exit().remove()

  force.start()
}
