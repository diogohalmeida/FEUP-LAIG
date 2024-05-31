class MyPrologInterface extends CGFobject{
	constructor(scene){
		super(scene);
	}


	makeMove(board, move){
		this.sendRequest("move(" + board + ",[" + move + "])", data => this.parseUpdatedBoard(data));
	}

	checkWin(board){
		this.sendRequest("checkWin(" + board + ")", data => this.parseCheckWinReply(data));
	}

	getAvailableMoves(piece,board){
		this.sendRequest("getMoves(" + board + "," + piece + ")", data => this.parseGetMovesReply(data));
	}

	getBotMove(board, piece, level){
		this.sendRequest("getBotMove(" + board + "," + piece + "," + level + ")", data => this.parseGetBotMoveReply(data));
	}

	getPrologRequest(requestString, parseFunction, onSuccess, onError, port) {
        var requestPort = port || 8081
        var request = new XMLHttpRequest();
        request.addEventListener("load", parseFunction);
        request.open('GET', 'http://localhost:' + requestPort + '/' + requestString, true);

        request.setRequestHeader('Content-Type', 'application/x-www-form-urlencoded; charset=UTF-8');
        request.send();
    }

    sendRequest(requestString, parseFunction) {                
        // Make Request
        this.getPrologRequest(requestString, parseFunction);
    }

	parseCheckWinReply(data){
		if(data.status === 400){
			console.log("Error");
			return;
		}
		var response = data.target.responseText;
		switch(parseInt(response)){
			case 0:
				this.scene.gameOrchestrator.state = 0;
				break;
			case 1:
				console.log("Black won the game!");
				this.scene.gameOrchestrator.state = 2;
				this.scene.gameOrchestrator.winner = 1;
				this.scene.gameOrchestrator.graph.nodes["turnIndicatorText"].leaves[0].text = "BLACK WINS"
				break;
			case 2:
				console.log("Red won the game!");
				this.scene.gameOrchestrator.state = 2;
				this.scene.gameOrchestrator.winner = 2;
				this.scene.gameOrchestrator.graph.nodes["turnIndicatorText"].leaves[0].text = " RED WINS ";
				break;

		}
		this.scene.gameOrchestrator.verifying = false;
		this.scene.gameOrchestrator.replied = true;
	}

	parseGetMovesReply(data){
		if(data.status === 400){
			console.log("Error");
			return;
		}

		var response = data.target.responseText;
		var index = 2;
		var auxArray = [];
		while(index < response.length){
			auxArray.push([response[index],response[index + 2]]);
			index += 2 + 85 + 5;
		}
		this.scene.gameOrchestrator.tilesToPlay = auxArray;

	}

	parseGetBotMoveReply(data){
		if(data.status === 400){
			console.log("Error");
			return;
		}

		var response = data.target.responseText;
		var gameOrchestrator = this.scene.gameOrchestrator;
		var responseBoard = response.slice(5,90);
		var player = gameOrchestrator.lastPlayer;
		var piece = gameOrchestrator.gameBoard.getPieceAvailable(player);
		gameOrchestrator.movePiece(new MyGameMove(this.scene,piece, piece.getTile(), gameOrchestrator.gameBoard.getTileFromCoordinates(response[3]-1,response[1]-1),gameOrchestrator.gameBoard.getBoardForProlog()));
		gameOrchestrator.nextBoard = this.getBoardFromResponse(responseBoard);
		gameOrchestrator.replied = true;
	}

	getBoardFromResponse(responseBoard){
		let response = responseBoard.slice(1, -1).split(",");
        var updatedBoard = [];
        var auxBoard = [];
        for (var x = 0; x < response.length; x++){
            if (response[x][0] == "["){
                auxBoard = [];
                auxBoard.push(response[x].substring(1))
            }
            else if (response[x].charAt(response[x].length - 1) == "]"){
                auxBoard.push(response[x].substring(0, response[x].length-1));
                updatedBoard.push(auxBoard);
            }
            else auxBoard.push(response[x]);
        }

        return updatedBoard;
	}

	parseUpdatedBoard(data){
		if(data.status === 400){
			console.log("Error");
			return;
		}

        this.scene.gameOrchestrator.nextBoard = this.getBoardFromResponse(data.target.responseText);
	}
}