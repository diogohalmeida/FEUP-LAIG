class MyGameBoard extends CGFobject{

	constructor(scene){
		super(scene);
		this.plane = new Plane(scene,10,10);
		this.tiles =
		[
			[new MyTile(this.scene, 1, 1, this, null), new MyTile(this.scene, 2, 1, this, null), new MyTile(this.scene, 3, 1, this, null), new MyTile(this.scene, 4, 1, this, null), new MyTile(this.scene, 5, 1, this, null), new MyTile(this.scene, 6, 1, this, null)],
            [new MyTile(this.scene, 1, 2, this, null), new MyTile(this.scene, 2, 2, this, null), new MyTile(this.scene, 3, 2, this, null), new MyTile(this.scene, 4, 2, this, null), new MyTile(this.scene, 5, 2, this, null), new MyTile(this.scene, 6, 2, this, null)],
            [new MyTile(this.scene, 1, 3, this, null), new MyTile(this.scene, 2, 3, this, null), new MyTile(this.scene, 3, 3, this, null), new MyTile(this.scene, 4, 3, this, null), new MyTile(this.scene, 5, 3, this, null), new MyTile(this.scene, 6, 3, this, null)],
            [new MyTile(this.scene, 1, 4, this, null), new MyTile(this.scene, 2, 4, this, null), new MyTile(this.scene, 3, 4, this, null), new MyTile(this.scene, 4, 4, this, null), new MyTile(this.scene, 5, 4, this, null), new MyTile(this.scene, 6, 4, this, null)],
            [new MyTile(this.scene, 1, 5, this, null), new MyTile(this.scene, 2, 5, this, null), new MyTile(this.scene, 3, 5, this, null), new MyTile(this.scene, 4, 5, this, null), new MyTile(this.scene, 5, 5, this, null), new MyTile(this.scene, 6, 5, this, null)],
            [new MyTile(this.scene, 1, 6, this, null), new MyTile(this.scene, 2, 6, this, null), new MyTile(this.scene, 3, 6, this, null), new MyTile(this.scene, 4, 6, this, null), new MyTile(this.scene, 5, 6, this, null), new MyTile(this.scene, 6, 6, this, null)],
		];

		this.auxiliarTilesBlackPieces = [new MyTile(this.scene, 7, 1, this, null), new MyTile(this.scene, 8, 1, this, null), new MyTile(this.scene, 9, 1, this, null), new MyTile(this.scene, 10, 1, this, null), new MyTile(this.scene, 11, 1, this, null), new MyTile(this.scene, 12, 1, this, null), new MyTile(this.scene, 13, 1, this, null), new MyTile(this.scene, 14, 1, this, null)];
		this.auxiliarTilesRedPieces = [new MyTile(this.scene, 7, 2, this, null), new MyTile(this.scene, 8, 2, this, null), new MyTile(this.scene, 9, 2, this, null), new MyTile(this.scene, 10, 2, this, null), new MyTile(this.scene, 11, 2, this, null), new MyTile(this.scene, 12, 2, this, null), new MyTile(this.scene, 13, 2, this, null), new MyTile(this.scene, 14, 2, this, null)];
		//this.board = new Plane(this.scene,32,32);
		for (var i = 0; i < 8; i++) {
			this.auxiliarTilesBlackPieces[i].setPiece(new MyPiece(this.scene,1,this.auxiliarTilesBlackPieces[i]));
			this.auxiliarTilesRedPieces[i].setPiece(new MyPiece(this.scene,2,this.auxiliarTilesRedPieces[i]));
		}
		this.tilesToBeOccupied = [];
	}

	addPieceToTile(x,y,piece){
		this.tiles[x][y].setPiece(piece);
	}

	getNumberBlackPieces(){
		var count = 0;
		this.tiles.forEach((row)=>{
			row.forEach((tile)=>{
				if (tile.piece != null){
					if (tile.piece.type == 1){
						count++;
					}
				}
				
			});
		})
		return count;
	}

	getNumberRedPieces(){
		var count = 0;
		this.tiles.forEach((row)=>{
			row.forEach((tile)=>{
				if (tile.piece != null){
					if (tile.piece.type == 2){
						count++;
					}
				}
			});
		})
		return count;
	}

	getPieceAvailable(type){
		var piece;
		if(type == 1){
			for (var i = 0; i < this.auxiliarTilesBlackPieces.length; i++) {
				piece = this.auxiliarTilesBlackPieces[i].piece;
				if(piece != null)
					return piece;
			}
		}
		else{
			for (var i = 0; i < this.auxiliarTilesRedPieces.length; i++) {
				piece = this.auxiliarTilesRedPieces[i].piece;
				if(piece != null)
					return piece;
			}
		}
	}

	removePieceFromTile(x,y){
		this.tiles[x][y].removePiece();
	}

	getPieceFromTile(x,y){
		this.tiles[x][y].getPiece();
	}

	getTileFromPiece(piece){
		piece.getTile();
	}

	getTileFromCoordinates(x,y){
		return this.tiles[y][x];
	}

	movePiece(piece,startTile,destinationTile){
		startTile.removePiece();
		destinationTile.setPiece(piece);
	}

	display(){
		this.scene.pushMatrix();
		this.scene.translate(-3.5,2.3,-3.5);
		
		for (var i = 0; i < 6; i++) {
			for (var j = 0; j < 6; j++) {
				this.tiles[i][j].display();
			}
		}
		
		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.translate(-10.5,1.95,3.0);
		for (var i = 0; i < 8; i++) {
			this.auxiliarTilesBlackPieces[i].display();
		}
		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.translate(-10.5,1.95,-6.0);
		for (var i = 0; i < 8; i++) {
			this.auxiliarTilesRedPieces[i].display();
		}
		this.scene.popMatrix();
		this.scene.pushMatrix();
		this.scene.popMatrix();
	}

	getBoardForProlog(){
		let board = "[";
		for (var y = 0; y < 6; y++) {
			let row = "[";
			for (var x = 0; x < 6; x++) {
				let piece = this.getTileFromCoordinates(x,y).getPiece();
				if(piece == null){
					row += "0";
				}
				else{
					if(piece.getType() == 1){
						row += "1";
					}
					else{
						row += "2";
					}
				}
				if(x < 5)
					row += ",";
			}
			board += row + "]";
			if(y < 5)
				board += ",";
		}
		board += "]";
		
		return board;
	}


    availableAuxiliarTile(type,tilesToBeOccupied){
    	if(type == 1){
    		for (var i = 0; i < 8; i++) {
		        if (this.auxiliarTilesBlackPieces[i].piece == null && !this.tilesToBeOccupied.includes(this.auxiliarTilesBlackPieces[i])) {
		            return this.auxiliarTilesBlackPieces[i];
		        }
	    	}
        	return null;
    	}
    	else if(type == 2){
    		for (var i = 0; i < 8; i++) {
		        if (this.auxiliarTilesRedPieces[i].piece == null && !this.tilesToBeOccupied.includes(this.auxiliarTilesRedPieces[i])) {
		            return this.auxiliarTilesRedPieces[i];
		        }
	    	}
        	return null;
    	}
    }

    getPiecesOut(nextBoard){
        var moves = [];
        var edgeTiles = [];
        for (var i = 1; i < 5; i++){
            if (nextBoard[0][i] == "0" && this.tiles[0][i].piece != null && (nextBoard[0][i+1] == "0"  || nextBoard[0][i-1] == "0")) edgeTiles.push(this.tiles[0][i]);
            if (nextBoard[i][0] == "0" && this.tiles[i][0].piece != null && (nextBoard[i+1][0] == "0"  || nextBoard[i-1][0] == "0")) edgeTiles.push(this.tiles[i][0]);
            if (nextBoard[5][i] == "0" && this.tiles[5][i].piece != null && (nextBoard[5][i+1] == "0"  || nextBoard[5][i-1] == "0")) edgeTiles.push(this.tiles[5][i]);
            if (nextBoard[i][5] == "0" && this.tiles[i][5].piece != null && (nextBoard[i+1][5] == "0"  || nextBoard[i-1][5] == "0")) edgeTiles.push(this.tiles[i][5]);
        }

        if (nextBoard[5][5] == "0" && this.tiles[5][5].piece != null) edgeTiles.push(this.tiles[5][5]);
        if (nextBoard[0][5] == "0" && this.tiles[0][5].piece != null) edgeTiles.push(this.tiles[0][5]);
        if (nextBoard[5][0] == "0" && this.tiles[5][0].piece != null) edgeTiles.push(this.tiles[5][0]);
        if (nextBoard[0][0] == "0" && this.tiles[0][0].piece != null) edgeTiles.push(this.tiles[0][0]);


        for (var j = 0; j < edgeTiles.length; j++) {
            var endTile = this.availableAuxiliarTile(edgeTiles[j].piece.type);
            var move = new MyGameMove(this.scene, edgeTiles[j].piece, edgeTiles[j], endTile, this);
            moves.push(move);
            this.tilesToBeOccupied.push(endTile);
        }
        return moves;
    }

}