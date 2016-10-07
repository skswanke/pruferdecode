var input = "4432";
var code = input.split();
var verts = [];
var edges = [];
for(var i=0;i<(input.length+2);i++){
    verts.add(i+1);
}
var vertsLeft = verts;
while(vertsLeft){
    edges.add([min(vertsLeft),code[0]])
}
