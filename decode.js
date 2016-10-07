var input = "4432";
var code = input.split();
var verts = [];
var edges = [];
for(var i=0;i<(input.length+2);i++){
    verts.add(i+1);
}
var vertsLeft = verts;
while(vertsLeft){
    while(code){
        minVert = min(vertsLeft.exclusion(code))
        makeEdge(minVert, code[0])
        code.pop[0];
        vertsLeft.pop[minVert]
    }
    makeEdge(vertsLeft[0], vertsLeft[1])
}
