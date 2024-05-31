%Gets an element from a specific cell
%nth0(?Index, ?List, ?Elem)
getSquarePiece(Column, Row, Content, GameState) :-
    nth1(Row, GameState, SelRow),
    nth1(Column, SelRow, Content).


%Predicates that gets a specific position of the board
newPosition(OutputRow,OutputColumn,OutputRow,OutputColumn).

newPosition(InputRow,InputColumn,OutputRow,OutputColumn):-
    InputColumn < 7,
    InputRow < 7,
    NewInputColumn is InputColumn + 1,
    newPosition(InputRow,NewInputColumn,OutputRow,OutputColumn).

newPosition(InputRow,InputColumn,OutputRow,OutputColumn):-
    InputColumn >= 7,
    InputRow < 7,
    NewInputColumn is 1,
    NewInputRow is InputRow + 1,
    newPosition(NewInputRow,NewInputColumn,OutputRow,OutputColumn).


%Verifies if a move is valid (square isn't occupied)
valid(Player,Column, Row, Board,UpdatedBoard):-
    getSquarePiece(Column, Row, 0, Board),
    putPiece(Board, Row, Column, Player, UpdatedBoard1),
    repulsion(Row, Column, UpdatedBoard1,UpdatedBoard),
    !.


%Calculates a possible Move returning the resulting Board
possibleMove(Player,Board,Row,Column,UpdatedBoard):-
    newPosition(1,1,Row,Column),
    valid(Player,Column, Row, Board, UpdatedBoard). 


%Calculates the points of a player by counting the number of pieces on the board
pointsForPiecesOnBoard(_,0,6,_,FinalPoints,FinalPoints).


pointsForPiecesOnBoard(Board,Row,Column,Player,Points,FinalPoints):-
    Column =< 0,
    Row > 0,
    NewColumn is 6,
    NewRow is Row-1,
    pointsForPiecesOnBoard(Board,NewRow,NewColumn,Player,Points,FinalPoints).


pointsForPiecesOnBoard(Board,Row,Column,Player,Points,FinalPoints):-
    Row > 0,
    Column > 0,
    getSquarePiece(Column,Row,Piece,Board),
    (
         Piece=:=Player-> NewPoints is Points+1;
         NewPoints = Points
    ),
    NewColumn is Column-1,
    pointsForPiecesOnBoard(Board,Row,NewColumn,Player,NewPoints,FinalPoints).



%Calculates the points of a player by counting the number of 2 in-a-row's on a row
pointsTwoInRow(_,0,0,_,_,FinalPoints,FinalPoints).


pointsTwoInRow(Counter,Row,0,Board,Player,Points,FinalPoints):-
    NewRow is Row-1,
    NewColumn is 6,
    pointsTwoInRow(Counter,NewRow,NewColumn,Board,Player,Points,FinalPoints).



pointsTwoInRow(Counter,Row,Column,Board,Player,Points,FinalPoints):-
    (
        Counter=:=2->NewCounter is 0,NewPoints is Points+1;
        NewCounter is Counter,NewPoints is Points    
    ),
    (
        getSquarePiece(Column,Row,Player,Board)->UpdatedCounter is NewCounter+1;
        UpdatedCounter is 0    
    ),
    NewColumn is Column-1,
    pointsTwoInRow(UpdatedCounter,Row,NewColumn,Board,Player,NewPoints,FinalPoints).



%Calculates the points of a player by counting the number of 2 in-a-row's on a column
pointsTwoInRowColumn(_,0,0,_,_,FinalPoints,FinalPoints).


pointsTwoInRowColumn(Counter,0,Column,Board,Player,Points,FinalPoints):-
    NewColumn is Column-1,
    NewRow is 6,
    pointsTwoInRowColumn(Counter,NewRow,NewColumn,Board,Player,Points,FinalPoints).



pointsTwoInRowColumn(Counter,Row,Column,Board,Player,Points,FinalPoints):-
    (
        Counter=:=2->NewCounter is 0,NewPoints is Points+1;
        NewCounter is Counter,NewPoints is Points    
    ),
    (
        getSquarePiece(Column,Row,Player,Board)->UpdatedCounter is NewCounter+1;
        UpdatedCounter is 0    
    ),
    NewRow is Row-1,
    pointsTwoInRowColumn(UpdatedCounter,NewRow,Column,Board,Player,NewPoints,FinalPoints).


%Calculates the points of a player by counting the number of 2 in-a-row's on the left diagonal
pointsTwoInRowLeftDiagonal(5,6,_,_,FinalPoints,FinalPoints).


pointsTwoInRowLeftDiagonal(Row,Column,Board,Player,Points,FinalPoints):-
    Column >= 6,
    Row < 6,
    NewRow is Row+1,
    NewColumn is 1,
    pointsTwoInRowLeftDiagonal(NewRow,NewColumn,Board,Player,Points,FinalPoints).

pointsTwoInRowLeftDiagonal(Row,Column,Board,Player,Points,FinalPoints):-
    Row < 6,
    Column < 6,
    NewRow is Row + 1,
    NewColumn is Column + 1,
    getSquarePiece(Column,Row,Piece1,Board),
    getSquarePiece(NewColumn,NewRow,Piece2,Board),
    (
        (Piece1 =:= Player, Piece2=:= Player)->NewPoints is Points+1,pointsTwoInRowLeftDiagonal(Row,NewColumn,Board,Player,NewPoints,FinalPoints);
        pointsTwoInRowLeftDiagonal(Row,NewColumn,Board,Player,Points,FinalPoints)
    ).


%Calculates the points of a player by counting the number of 2 in-a-row's on the right diagonal
pointsTwoInRowRightDiagonal(2,6,_,_,FinalPoints,FinalPoints).


pointsTwoInRowRightDiagonal(Row,Column,Board,Player,Points,FinalPoints):-
    Column >= 6,
    Row > 1,
    NewRow is Row-1,
    NewColumn is 1,
    pointsTwoInRowRightDiagonal(NewRow,NewColumn,Board,Player,Points,FinalPoints).

pointsTwoInRowRightDiagonal(Row,Column,Board,Player,Points,FinalPoints):-
    Row > 1,
    Column < 6,
    NewRow is Row - 1,
    NewColumn is Column + 1,
    getSquarePiece(Column,Row,Piece1,Board),
    getSquarePiece(NewColumn,NewRow,Piece2,Board),
    (
        (Piece1 =:= Player, Piece2=:= Player)->NewPoints is Points+1,pointsTwoInRowRightDiagonal(Row,NewColumn,Board,Player,NewPoints,FinalPoints);
    pointsTwoInRowRightDiagonal(Row,NewColumn,Board,Player,Points,FinalPoints)
    ).


%Calculates the points of a player by counting the number of 2 in-a-row's on the board
pointsForTwoInRow(Board,Player,Points):-
    pointsTwoInRow(0,6,6,Board,Player,0,Points1),
    pointsTwoInRowColumn(0,6,6,Board,Player,0,Points2),
    pointsTwoInRowLeftDiagonal(1,1,Board,Player,0,Points3),
    pointsTwoInRowRightDiagonal(6,1,Board,Player,0,Points4),
    Points is (Points1 + Points2 + Points3 + Points4).


%Predicates that calculates the points for each board on the List
pointsOfBoards([],FinalListOfBoards,_,FinalListOfBoards).

pointsOfBoards([H|T],ListBoards,Player,FinalListOfBoards):-
    player(Player,OtherPlayer),
    nth0(0,H,Row),
    nth0(1,H,Column),
    nth0(2,H,Board),
    value(Board,Player,PlayerPoints),
    value(Board,OtherPlayer,OpponentPoints),
    Points is (PlayerPoints - 3*OpponentPoints),
    append(ListBoards,[[Row,Column,Board,Points]],NewListBoards),
    pointsOfBoards(T,NewListBoards,Player,FinalListOfBoards).


%Calculates the total points of a board
value(GameState,Player,Value):-
    (
        checkAll(GameState,Player)->Points1 is 100;
        Points1 is 0
    ),
    pointsForPiecesOnBoard(GameState,6,6,Player,0,Points2),
    pointsForTwoInRow(GameState,Player,Points3),
    Value is Points1 + Points2 + Points3.


%Selects the boards with the best score
selectBestBoards(_,[],FinalBestBoards,FinalBestBoards).

selectBestBoards(BestPoints,[H|T],BestBoards,FinalBestBoards):-
    nth0(3,H,Points),
    (
        BestPoints < Points->selectBestBoards(Points,T,[H],FinalBestBoards);
        (
            BestPoints=:=Points->append(BestBoards,[H],NewBestBoards),selectBestBoards(BestPoints,T,NewBestBoards,FinalBestBoards);
            selectBestBoards(BestPoints,T,BestBoards,FinalBestBoards)
            
        )
    ).


%Calculates every resulting Board for every possible move for the given Board and returns it in a List
valid_moves(GameState,Player,ListOfMoves):-
    findall([Row,Column,UpdatedBoard],possibleMove(Player,GameState,Row,Column,UpdatedBoard),ListOfMoves).


%Chooses a random move from a List of moves
choose([], []).
choose(List, Elt) :-
    length(List, Length),
    random(0, Length, Index),
    nth0(Index, List, Elt),!.
