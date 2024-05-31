/**
 * MyTriangle
 * @constructor
 * @param scene - Reference to MyScene object
 */
class MyTriangle extends CGFobject {
	constructor(scene, x1, y1, x2, y2, x3, y3) {
		super(scene);
		this.x1 = x1;
		this.y1 = y1;
		this.x2 = x2;
		this.y2 = y2;
		this.x3 = x3;
		this.y3 = y3;
		this.a = Math.sqrt(Math.pow((this.x2-this.x1),2) + Math.pow((this.y2-this.y1),2));
		this.b = Math.sqrt(Math.pow((this.x3-this.x2),2) + Math.pow((this.y3-this.y2),2));
		this.c = Math.sqrt(Math.pow((this.x1-this.x3),2) + Math.pow((this.y1-this.y3),2));
		this.alpha = Math.acos((Math.pow(this.a,2) - Math.pow(this.b,2) + Math.pow(this.c,2))/(2*this.a*this.c));

		this.initBuffers();
	}
	initBuffers() {
		this.vertices = [
			this.x1, this.y1, 0,	//0
			this.x2, this.y2, 0,	//1
			this.x3, this.y3, 0	//2
		];

		//Counter-clockwise reference of vertices
		this.indices = [
			0, 1, 2,
			2, 1,0 
		];

		this.normals = [
			0, 0, 1,
			0, 0, 1,
			0, 0, 1,
		]

		this.initializeTextCoords();

		//The defined indices (and corresponding vertices)
		//will be read in groups of three to draw triangles
		this.primitiveType = this.scene.gl.TRIANGLES;

		this.initGLBuffers();
	}

	initializeTextCoords(){
		var T3u = this.c*Math.cos(this.alpha);
		var T3v = 1-this.c*Math.sin(this.alpha); 

		this.texCoords = [
			0, 1,
			this.a, 1,
			T3u, T3v
		]
	}

	updateTexCoords(afs,aft){
		var T3u = this.c*Math.cos(this.alpha)/afs;
		var T3v = 1-this.c*Math.sin(this.alpha)/aft; 

		this.texCoords = [
			0, 1,
			this.a/afs, 1,
			T3u, T3v
		]
		this.updateTexCoordsGLBuffers();
	}
}

