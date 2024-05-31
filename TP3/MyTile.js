class MyTile extends CGFobject {
	constructor(scene,x,y,board,piece){
		super(scene);
		this.x = x;
		this.y = y;
		this.board = board;
		this.piece = piece;
		this.plane = new Plane(scene,32,32);
	}

	getPiece(){
		return this.piece;
	}

	setPiece(piece){
		this.piece = piece;
	}

	removePiece(){
		if(this.piece != null){
			this.piece = null;
		}
		else
			console.log("There isn't a piece tile with x=" + this.x + " and y=" + this.y);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.translate(this.x,0,this.y);
		if (this.piece == null) {	//Only allows picking if the square is free
            this.scene.registerForPick(this.x*10+this.y, this);
		}
		else{
			this.scene.registerForPick(this.x*10+this.y,this.getPiece());
			this.piece.display();
		}
		this.scene.graph.materials["white"].apply();
		this.scene.graph.materials["white"].setTexture(this.scene.graph.textures["tile"]);
		this.plane.display();
		this.scene.clearPickRegistration();
		this.scene.popMatrix();
	}
}