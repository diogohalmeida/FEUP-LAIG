class MyAnimator extends CGFobject{
	constructor(scene, orchestrator){
		super(scene);
		this.orchestrator = orchestrator;
	}

	animate(move){
		this.scene.animating = true;
		this.startTime = 0;
		this.startTile = move.startTile;
		this.endTile = move.endTile;
		this.piece = move.piece;
		this.board = move.board;
		let matrix = mat4.create();
		mat4.translate(matrix,matrix,[this.startTile.x,0,this.startTile.y]);
		this.animation = new KeyFrameAnimation(this.scene, null, matrix);
		if(this.startTile.y == 1 && this.startTile.x > 6){
			this.animation.keyframes.push(new Keyframe(0, [this.startTile.x-10.5, 0 + 1.95, this.startTile.y+3], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(1, [this.startTile.x-10.5, 2 + 1.95, this.startTile.y+3], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(2, [this.endTile.x-3.5, 2 + 2.3, this.endTile.y-3.5], [0, 0, 0], [1, 1, 1]));
	        this.animation.keyframes.push(new Keyframe(3, [this.endTile.x-3.5, 0 + 2.3, this.endTile.y-3.5], [0, 0, 0], [1, 1, 1]));
		}
		else if(this.startTile.y == 2 && this.startTile.x > 6){
	        this.animation.keyframes.push(new Keyframe(0, [this.startTile.x-10.5, 0 + 1.95, this.startTile.y-6], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(1, [this.startTile.x-10.5, 2 + 1.95, this.startTile.y-6], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(2, [this.endTile.x-3.5, 2 + 2.3, this.endTile.y-3.5], [0, 0, 0], [1, 1, 1]));
	        this.animation.keyframes.push(new Keyframe(3, [this.endTile.x-3.5, 0 + 2.3, this.endTile.y-3.5], [0, 0, 0], [1, 1, 1]));
		}
		if(this.endTile.y == 1){
			this.animation.keyframes.push(new Keyframe(0, [this.startTile.x-3.5, 0 + 2.3, this.startTile.y-3.5], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(1, [this.startTile.x-3.5, 2 + 2.3, this.startTile.y-3.5], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(2, [this.endTile.x-10.5, 2 + 1.95, this.endTile.y+3], [0, 0, 0], [1, 1, 1]));
	        this.animation.keyframes.push(new Keyframe(3, [this.endTile.x-10.5, 0 + 1.95, this.endTile.y+3], [0, 0, 0], [1, 1, 1]));
		}
		else if(this.endTile.y == 2){
			this.animation.keyframes.push(new Keyframe(0, [this.startTile.x-3.5, 0 + 2.3, this.startTile.y-3.5], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(1, [this.startTile.x-3.5, 2 + 2.3, this.startTile.y-3.5], [0, 0, 0], [1, 1, 1]));
			this.animation.keyframes.push(new Keyframe(2, [this.endTile.x-10.5, 2 + 1.95, this.endTile.y-6], [0, 0, 0], [1, 1, 1]));
	        this.animation.keyframes.push(new Keyframe(3, [this.endTile.x-10.5, 0 + 1.95, this.endTile.y-6], [0, 0, 0], [1, 1, 1]));
		}
	}

	update(time){
		if(this.startTime == 0){
			this.startTime = time;
		}
		else if(time - this.startTime > 3000 && this.scene.animating){
			this.scene.animating = false;
			if(this.endTile.x > 6){
				this.endTile.setPiece(this.piece);
				this.piece.setTile(this.endTile);
			}
			var moves = [];
			if(!this.scene.undoActive)
				moves = this.orchestrator.gameBoard.getPiecesOut(this.orchestrator.nextBoard);
			var oppositeMoves = [];
			if(moves.length > 0){
				this.scene.animatePiecesOut = true;
				for (var i = 0; i < moves.length; i++) {
					var animator = new MyAnimator(this.scene,this.orchestrator);
					oppositeMoves.push(new MyGameMove(this.scene,moves[i].piece,moves[i].endTile,moves[i].startTile,moves[i].board));
					animator.animate(moves[i]);
					this.orchestrator.animatorList.push(animator);
				}
				this.orchestrator.gameSequence.auxiliaryMoves[this.orchestrator.gameSequence.moves.length-1] = oppositeMoves;	
			}
			this.orchestrator.updateBoard();
			if(this.orchestrator.state != 2){
				this.scene.animateCameraRotation = true;
				this.updateScoreBoard();
			}
		}
		else if(time - this.startTime > 3000 && this.scene.animatePiecesOut){
			this.endTile.setPiece(this.piece);
			this.piece.setTile(this.endTile);
			if(this == this.orchestrator.animatorList[this.orchestrator.animatorList.length-1]){
				this.scene.animatePiecesOut = false;
				this.orchestrator.animatorList = [];
				this.orchestrator.gameBoard.tilesToBeOccupied = [];
			}
			else if(this == this.orchestrator.reverseAnimatorList[this.orchestrator.reverseAnimatorList.length-1]){
				this.orchestrator.reverseAnimatorList = [];
				this.scene.animatePiecesOut = false;
			}
		}
		if(time - this.startTime < 3000){
			this.animation.update(time-this.startTime);
		}
	}

	display(){
		this.scene.pushMatrix();
		this.animation.apply();
		this.piece.display();
		this.scene.popMatrix();
	}

	updateScoreBoard(){
		this.orchestrator.graph.nodes["scoreCounterText1"].leaves[0].text = this.orchestrator.gameBoard.getNumberBlackPieces().toString();
		this.orchestrator.graph.nodes["scoreCounterText2"].leaves[0].text = this.orchestrator.gameBoard.getNumberRedPieces().toString();
		if (!this.scene.moviePlaying){
			if (this.orchestrator.player == 2){
				this.orchestrator.graph.nodes["turnIndicatorText"].leaves[0].text = " RED TURN ";
			}
			else{
				this.orchestrator.graph.nodes["turnIndicatorText"].leaves[0].text = "BLACK TURN";
			}
		}
	}
}