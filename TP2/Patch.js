class Patch extends CGFobject{
	constructor(scene,nPointsU,nPointsV,nPartsU,nPartsV,controlPoints){
		super(scene);
		this.nPointsU = nPointsU;
		this.nPointsV = nPointsV;
		this.nPartsU = nPartsU;
		this.nPartsV = nPartsV;
		this.controlPoints = [];

		var numberControlPoints = 0;

		for (var i = 0; i < nPointsU; i++) {
			var VPoints = [];
			for (var j = 0; j < nPointsV; j++) {
				VPoints.push(controlPoints[numberControlPoints]);
				numberControlPoints++;
			}
			this.controlPoints.push(VPoints);
		}

		this.nurbsSurface = new CGFnurbsSurface(this.nPointsU-1,this.nPointsV-1,this.controlPoints);

		this.nurbsObject = new CGFnurbsObject(this.scene,this.nPartsU,this.nPartsV,this.nurbsSurface);

	}


	display(){
		this.nurbsObject.display();
	}

	updateTexCoords(afs,aft){

	}
}