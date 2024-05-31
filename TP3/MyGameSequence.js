class MyGameSequence extends CGFobject{
	constructor(scene){
		super(scene);
		this.moves = [];
		this.auxiliaryMoves = {};
	}

	addMove(move){
		this.moves.push(move);
	}

	undo(){
		var move = this.moves.pop();

		return move;
	}

	animate(){
		if(this.currentMove == this.moves.length){
				this.scene.moviePlaying = false;
				this.scene.gameOrchestrator.animator.updateScoreBoard();
		}
		else{
			var move = this.moves[this.currentMove];
			this.scene.gameOrchestrator.prolog.makeMove(this.scene.gameOrchestrator.gameBoard.getBoardForProlog(), [move.endTile.y,move.endTile.x,move.piece.type]);
			this.scene.gameOrchestrator.movePiece(move);

			this.scene.gameOrchestrator.changeTurn();

			this.currentMove++;
		}
	}
}