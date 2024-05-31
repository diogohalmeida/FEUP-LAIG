class MyTorus extends CGFobject{

    constructor(scene, innerRadius, outerRadius, slices, loops){

        super(scene);

        this.innerRadius = innerRadius;
        this.outerRadius = outerRadius;
        this.slices = slices;
        this.loops = loops;

        this.initBuffers();
    };

    initBuffers() {

        this.vertices = [];
        this.indices = [];
        this.normals = [];
        this.texCoords = [];

        for (var nLoop = 0; nLoop <= this.loops; nLoop++) {

            var theta = nLoop * 2 * Math.PI / this.loops;
            var cosTheta = Math.cos(theta);
            var sinTheta = Math.sin(theta);

            for (var slice = 0; slice <= this.slices; slice++) {

                var phi = slice * 2 * Math.PI / this.slices;

                var sinPhi = Math.sin(phi);
                var cosPhi = Math.cos(phi);

                var x = (this.outerRadius + (this.innerRadius * cosTheta)) * cosPhi;
                var y = (this.outerRadius + (this.innerRadius * cosTheta)) * sinPhi;
                var z = this.innerRadius * sinTheta;
                var s = (nLoop / this.loops);
                var t = (slice / this.slices);

                this.vertices.push(x, y, z);
                this.normals.push(x, y, z);
                this.texCoords.push(t, s);
            }
        }

        for (var nLoop = 0; nLoop < this.loops; nLoop++) {
            for (var slice = 0; slice < this.slices; slice++) {

                var a = (nLoop * (this.slices + 1)) + slice;
                var b = a + this.slices + 1;

                this.indices.push(a, b + 1, b);
                this.indices.push(a, a + 1, b + 1);
            }
        }

        this.primitiveType = this.scene.gl.TRIANGLES;
        this.initGLBuffers();
    }
    updateTexCoords(afs,aft){
        this.updateTexCoordsGLBuffers();
    }
}