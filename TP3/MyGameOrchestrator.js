class MyGameOrchestrator extends CGFobject{
	constructor(scene){
		super(scene);
		this.graph;
		this.prolog = new MyPrologInterface(this.scene);
		this.graph;
		this.gameBoard = new MyGameBoard(this.scene);
		this.gameStarted = false;
	}

	restart(){
		this.gameSequence = new MyGameSequence(this.scene);
		this.animator = new MyAnimator(this.scene, this);
		this.gameBoard = new MyGameBoard(this.scene);
        this.nextBoard;
		this.tilesToPlay = [];
		this.state = 0;
		this.player = 1;
		this.winner;
		this.verifying = false;
        this.lastPlayer;
        this.startTile = null;
        this.replied = true;
		this.animatorList = [];
		this.reverseAnimatorList = [];
		this.startTime = 0;
		this.timePassed = 0;
		this.madeMove = false;
		this.gameStarted = true;
		this.timeTurn = this.scene.turnTime+1;

		//Reset cameras and score board
		this.scene.cameras[this.scene.defaultCameraId].setPosition(vec3.fromValues(0, 10, 10));
		this.animator.updateScoreBoard();
	}

	changeTurn(){
		this.lastPlayer = this.player;
		this.player = 1 + (this.player%2);
		this.tilesToPlay = [];
		this.startTile = null;	
		
		//Timer reset
		this.startTime = 0;
		this.timePassed = 0;
		this.madeMove = false;
		this.timeTurn = this.scene.turnTime+1;
	}

	managePick(mode){
		var results = this.scene.pickResults;
		if(mode == false){
			if(results != null && results.length > 0){
				for (var i = 0; i < results.length; i++) {
					var selectedObject = results[i][0];
					if(selectedObject){
						var list = ['A','B','C','D','E','F'];
						var customId = results[i][1].toString();
						var move = [customId[1], customId[0], this.player];
						var squareId = list[customId[0]-1]+customId[1];
						this.OnObjectSelected(selectedObject, squareId, move);
					}
				}
				results.splice(0,results.length);
			}
		}
	}

	movePiece(move){
		this.scene.undoActive = false;
		this.madeMove = true;
		this.state = 0;
		if(!this.scene.moviePlaying){
			this.gameSequence.addMove(move);
		}
		this.animator.animate(move);
		move.startTile.removePiece();
		move.piece.setTile(move.endTile);
	}

	OnObjectSelected(selectedObject, Id, move){ 
		if(selectedObject instanceof MyPiece){
			if(selectedObject.type == this.player && !this.scene.animating && !this.scene.animatePiecesOut){
				this.state = 1;
				this.startTile = selectedObject.getTile();
			}
		}
		else if(selectedObject instanceof MyTile){
			if(this.startTile != null){
				this.prolog.makeMove(this.gameBoard.getBoardForProlog(), move);
				this.movePiece(new MyGameMove(this.scene,this.startTile.getPiece(),this.startTile,selectedObject, this.nextBoard));
				this.changeTurn();
			}
		}
	}

	orchestrate(){
		if (!this.scene.moviePlaying){
			var gameMode = this.scene.gameModeSelected;
			if(gameMode != 0 && !this.scene.animating && !this.scene.animatePiecesOut){
				var level;
				if(this.scene.botLevel == 0){
					level = "b1";
				}
				else{
					level = "b2";
				}
				if(gameMode == 2 && this.replied && !this.verifying){
					this.replied = false;
					this.prolog.getBotMove(this.gameBoard.getBoardForProlog(),this.player,level);
					this.changeTurn();
				}
				else if(gameMode == 1 && this.player == 2 && !this.verifying){
					this.prolog.getBotMove(this.gameBoard.getBoardForProlog(),this.player,level);
					this.changeTurn();
				}
			}
		}
	}

	undo(){
		if(this.gameSequence.moves.length > 0 && !this.scene.animating){
			this.scene.undoActive = true;
			let move = this.gameSequence.undo();
			var board;
			if(this.gameSequence.moves.length != 0){
				board = move.board;
			}	
			else{
				board = "[[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0],[0,0,0,0,0,0]]";
			}
			this.nextBoard = board;
			this.scene.animating = true;
			var moves = this.gameSequence.auxiliaryMoves[this.gameSequence.moves.length];
			if(moves != null){
				var auxiliarAnimator;
				for (var i = 0; i < moves.length; i++) {
					auxiliarAnimator = new MyAnimator(this.scene,this);
					moves[i].startTile.removePiece();
					auxiliarAnimator.animate(moves[i]);
					this.reverseAnimatorList.push(auxiliarAnimator);
				}
				delete this.gameSequence[this.gameSequence.moves.length];
				this.scene.animatePiecesOut = true;
			}	
			this.animator.animate(new MyGameMove(this.scene, move.endTile.getPiece(), move.endTile, move.startTile, board));
			move.endTile.removePiece();
			this.verifyWinner();
			this.animator.updateScoreBoard();
			this.changeTurn();

		}
	}

	movie(){
		this.graph.nodes["turnIndicatorText"].leaves[0].text = "PLAY MOVIE";
		this.resetBoard();
		this.gameSequence.currentMove = 0;
		this.player = 1;
	}

	resetBoard(){
		for (var x = 0; x < 6; x++) {
            for (var y = 0; y < 6; y++){
                this.gameBoard.tiles[y][x].piece = null; 
           	}
        }
        for (var i = 0; i < this.gameBoard.auxiliarTilesBlackPieces.length; i++) {
        	if(this.gameBoard.auxiliarTilesBlackPieces[i].piece == null){
        		this.gameBoard.auxiliarTilesBlackPieces[i].piece = new MyPiece(this.scene,1,this.gameBoard.auxiliarTilesBlackPieces[i]);
        	}
        	if(this.gameBoard.auxiliarTilesRedPieces[i].piece == null){
        		this.gameBoard.auxiliarTilesRedPieces[i].piece = new MyPiece(this.scene,2,this.gameBoard.auxiliarTilesRedPieces[i]);
        	}
        }
	}

	updateBoard(){
		for (var x = 0; x < 6; x++) {
            for (var y = 0; y < 6; y++){
                switch(this.nextBoard[y][x]){
                    case "0":
                        this.gameBoard.tiles[y][x].piece = null;
                        break;
                    case "1":
                        this.gameBoard.tiles[y][x].setPiece(new MyPiece(this.scene, 1));
                        break;
                    case "2":
                        this.gameBoard.tiles[y][x].setPiece(new MyPiece(this.scene, 2));
                        break;
                    default:
                        break;
                }
            }
		}
		this.verifying = true;
		this.verifyWinner();
	}

	display(){
		if(this.scene.animating){
			this.animator.display();
		}
		if(this.scene.animatePiecesOut){
			for (var i = 0; i < this.animatorList.length; i++) {
                this.animatorList[i].display();
            }
            for (var i = 0; i < this.reverseAnimatorList.length; i++) {
            	this.reverseAnimatorList[i].display();
            }
		}
		if(this.scene.moviePlaying && !this.scene.animating && !this.scene.animatePiecesOut)
			this.gameSequence.animate();
	}

	changeTheme(theme){
		this.scene.graph = this.scene.xmlScenes[theme];
		this.graph = this.scene.xmlScenes[theme];
		if (this.animator != null)
			this.animator.updateScoreBoard();
    }
	
	verifyWinner(){
		this.prolog.checkWin(this.gameBoard.getBoardForProlog());
	}
}