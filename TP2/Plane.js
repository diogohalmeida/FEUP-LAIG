class Plane extends CGFobject{
	constructor(scene,nPartsU,nPartsV){
		super(scene);
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints = [
			[
	            [0.5,0.0,-0.5,1.0],
	            [0.5,0.0, 0.5,1.0]
        	],
        	[
	            [-0.5,0.0,-0.5,1.0],
	            [-0.5,0.0, 0.5,1.0]
        	]
		];

		this.nurbsSurface = new CGFnurbsSurface(1,1,this.controlPoints);

		this.nurbsObject = new CGFnurbsObject(this.scene,this.nPartsU,this.nPartsV,this.nurbsSurface);
	}

	display(){
		this.nurbsObject.display();
	}

	updateTexCoords(afs,aft){

	}
}