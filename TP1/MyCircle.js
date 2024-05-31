class MyCircle extends CGFobject {

  constructor(scene, slices, radius) {
    super(scene);
    this.slices = slices;
    this.radius = radius;

    this.initBuffers();
  }


  initBuffers() {
    this.vertices = [];
    this.indices = [];
    this.normals = [];
    this.texCoords=[];

    var ang = 2*Math.PI/this.slices;

    this.vertices.push(0,0,0);
    this.normals.push(0,0,1);
    this.texCoords.push(0.5,0.5);

    for (var i = 0; i <= this.slices; i++) {
      
      this.vertices.push(this.radius*Math.cos(ang * i), this.radius*Math.sin(ang * i), 0);
      this.normals.push(0, 0, 1);
      this.texCoords.push(0.5 + Math.cos(ang * i) / 2, 0.5 - Math.sin(ang * i) / 2);
      
      this.indices.push(0, i, i + 1); 
    }

    this.primitiveType = this.scene.gl.TRIANGLES;
    this.initGLBuffers();
  }

  updateBuffers(complexity){

    this.initBuffers();
    this.initNormalVizBuffers();
  }
}