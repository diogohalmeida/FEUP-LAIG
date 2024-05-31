%Verifies if there is a 3 in-a-row on the given board
checkAll(Board,Piece):-
    checkAllRowsCols(7,7,Board,Piece).


%Auxiliary Predicates that check 3 in-a-row in Left Diagonal
threeInRowLeftDiagonal(0,_,_,_,_).

threeInRowLeftDiagonal(Counter,Row,Col,Board,Piece):-
    Row < 7,
    Col < 7,
    getSquarePiece(Col,Row,Piece,Board),
    NewRow is Row-1,
    NewCol is Col-1,
    NewCounter is Counter-1,
    threeInRowLeftDiagonal(NewCounter,NewRow,NewCol,Board,Piece),
    !.


%Auxiliary Predicates that check 3 in-a-row in Right Diagonal
threeInRowRightDiagonal(0,_,_,_,_).

threeInRowRightDiagonal(Counter,Row,Col,Board,Piece):-
    Row < 7,
    Col < 7,
    getSquarePiece(Col,Row,Piece,Board),
    NewRow is Row-1,
    NewCol is Col+1,
    NewCounter is Counter-1,
    threeInRowRightDiagonal(NewCounter,NewRow,NewCol,Board,Piece),
    !.


%Auxiliary Predicates that check 3 in-a-row in a Column
threeInRowColumn(0,_,_,_,_).

threeInRowColumn(Counter,Row,Col,Board,Piece):-
    Row < 7,
    Col < 7,
    getSquarePiece(Col,Row,Piece,Board),
    NewRow is Row-1,
    NewCounter is Counter-1,
    threeInRowColumn(NewCounter,NewRow,Col,Board,Piece),
    !.


%Auxiliary Predicates that check 3 in-a-row in a Row
threeInRowRow(0,_,_,_,_).

threeInRowRow(Counter,Row,Col,Board,Piece):-
    Row < 7,
    Col < 7,
    getSquarePiece(Col,Row,Piece,Board),
    NewCol is Col-1,
    NewCounter is Counter-1,
    threeInRowRow(NewCounter,Row,NewCol,Board,Piece),
    !.


%Auxiliary Predicates that check 3 in-a-row
checkAllRowsCols(Row,Col,Board,Piece):-
    Row > 0,
    Col > 0,
    threeInRowLeftDiagonal(3,Row,Col,Board,Piece);
    threeInRowRightDiagonal(3,Row,Col,Board,Piece);
    threeInRowColumn(3,Row,Col,Board,Piece);
    threeInRowRow(3,Row,Col,Board,Piece).

checkAllRowsCols(Row,Col,Board,Piece):-
    Row > 0,
    Col > 0,
    NextRow is Row-1,
    checkAllRowsCols(NextRow,Col,Board,Piece).

checkAllRowsCols(Row,Col,Board,Piece):-
    Row > 0,
    Col > 0,
    NextCol is Col-1,
    checkAllRowsCols(Row,NextCol,Board,Piece).


%Auxiliary Predicates that handle Top Left Diagonal Repulsions
checkTopLeftDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewCol is Column-1,
    NewRow > 0,
    NewCol > 0,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,NewCol,Piece,UpdatedBoard1),putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkTopLeftDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewRow =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard);
    NewCol is Column-1,
    NewCol =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkTopLeftDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewRow =< 0,
    UpdatedBoard = Board;
    NewCol is Column-1,
    NewCol =< 0,
    UpdatedBoard = Board.

checkTopLeftDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewCol is Column-1,
    NewRow > 0,
    NewCol > 0,
    NewN is N-1,
    getSquarePiece(NewCol,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkTopLeftDiagonal(NewN,NewRow,NewCol,Board,UpdatedBoard)).


%Auxiliary Predicates that handle Upper Repulsions
checkUpperColumn(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewRow > 0,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(Column,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,Column,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkUpperColumn(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewRow =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkUpperColumn(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewRow > 0,
    NewN is N-1,
    getSquarePiece(Column,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkUpperColumn(NewN,NewRow,Column,Board,UpdatedBoard)).

checkUpperColumn(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewRow =< 0,
    Column > 0,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Top Right Diagonal Repulsions
checkTopRightDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewRow > 0,
    NewCol is Column+1,
    NewCol < 7,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,NewCol,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkTopRightDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row-1,
    NewRow =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard);
    NewCol is Column+1,
    NewCol >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard).
    

checkTopRightDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewCol is Column+1,
    NewRow > 0,
    NewCol < 7,
    NewN is N-1,
    getSquarePiece(NewCol,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkTopRightDiagonal(NewN,NewRow,NewCol,Board,UpdatedBoard)).


checkTopRightDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row-1,
    NewRow =< 0,
    UpdatedBoard = Board;
    NewCol is Column+1,
    NewCol >= 7,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Right Repulsions
checkRightRow(0,Row,Column,Board,UpdatedBoard):-
    NewCol is Column+1,
    NewCol < 7,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,Row,P,Board),
    (P==0->putPiece(Board,Row,NewCol,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkRightRow(0,Row,Column,Board,UpdatedBoard):-
    NewCol is Column+1,
    NewCol >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkRightRow(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewCol is Column+1,
    NewCol < 7,
    NewN is N-1,
    getSquarePiece(NewCol,Row,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkRightRow(NewN,Row,NewCol,Board,UpdatedBoard)).

checkRightRow(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewCol is Column+1,
    NewCol >= 7,
    Row > 0,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Bottom Right Diagonal Repulsions
checkBottomRightDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow < 7,
    NewCol is Column+1,
    NewCol < 7,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,NewCol,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkBottomRightDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard);
    NewCol is Column+1,
    NewCol >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkBottomRightDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow < 7,
    NewCol is Column+1,
    NewCol < 7,
    NewN is N-1,
    getSquarePiece(NewCol,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkBottomRightDiagonal(NewN,NewRow,NewCol,Board,UpdatedBoard)).

checkBottomRightDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow >= 7,
    UpdatedBoard = Board;
    NewCol is Column+1,
    NewCol >= 7,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Bottom Repulsions
checkBottomColumn(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow < 7,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(Column,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,Column,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkBottomColumn(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkBottomColumn(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow < 7,
    NewN is N-1,
    getSquarePiece(Column,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkBottomColumn(NewN,NewRow,Column,Board,UpdatedBoard)).

checkBottomColumn(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow >= 7,
    Column > 0,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Bottom Left Diagonal Repulsions
checkBottomLeftDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow < 7,
    NewCol is Column-1,
    NewCol > 0,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,NewRow,P,Board),
    (P==0->putPiece(Board,NewRow,NewCol,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkBottomLeftDiagonal(0,Row,Column,Board,UpdatedBoard):-
    NewRow is Row+1,
    NewRow >= 7,
    putPiece(Board,Row,Column,0,UpdatedBoard);
    NewCol is Column-1,
    NewCol =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkBottomLeftDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow < 7,
    NewCol is Column-1,
    NewCol > 0,
    NewN is N-1,
    getSquarePiece(NewCol,NewRow,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkBottomLeftDiagonal(NewN,NewRow,NewCol,Board,UpdatedBoard)).

checkBottomLeftDiagonal(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewRow is Row+1,
    NewRow >= 7,
    UpdatedBoard = Board;
    NewCol is Column-1,
    NewCol =< 0,
    UpdatedBoard = Board.


%Auxiliary Predicates that handle Left Repulsions
checkLefttRow(0,Row,Column,Board,UpdatedBoard):-
    NewCol is Column-1,
    NewCol > 0,
    getSquarePiece(Column,Row,Piece,Board),
    getSquarePiece(NewCol,Row,P,Board),
    (P==0->putPiece(Board,Row,NewCol,Piece,UpdatedBoard1), putPiece(UpdatedBoard1,Row,Column,0,UpdatedBoard);
    UpdatedBoard = Board).

checkLefttRow(0,Row,Column,Board,UpdatedBoard):-
    NewCol is Column-1,
    NewCol =< 0,
    putPiece(Board,Row,Column,0,UpdatedBoard).

checkLefttRow(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewCol is Column-1,
    NewCol > 0,
    NewN is N-1,
    getSquarePiece(NewCol,Row,Piece,Board),
    (Piece==0->UpdatedBoard = Board;
    checkLefttRow(NewN,Row,NewCol,Board,UpdatedBoard)).

checkLefttRow(N,Row,Column,Board,UpdatedBoard):-
    N > 0,
    NewCol is Column-1,
    NewCol =< 0,
    Row > 0,
    UpdatedBoard = Board.


%Predicates that check if the board has an equal number of pieces to Counter
checkNumberPieces(0,_,_,_,_).

checkNumberPieces(Counter,Row,Column,Piece,Board):-
    Column > 0,
    Row > 0,
    getSquarePiece(Column,Row,P,Board),
    (P=:=Piece->NewCounter is Counter-1;
        NewCounter = Counter),
    NewColumn is Column-1,
    checkNumberPieces(NewCounter,Row,NewColumn,Piece,Board).

checkNumberPieces(Counter,Row,Column,Piece,Board):-
    Column =< 0,
    NewColumn is 6,
    NewRow is Row -1,
    checkNumberPieces(Counter,NewRow,NewColumn,Piece,Board).

%Executes the game's repulsions in all direction after a piece is placed
repulsion(Row,Column,Board,UpdatedBoard):-
    checkTopLeftDiagonal(1,Row,Column,Board,UpdatedBoard1),
    checkUpperColumn(1,Row,Column,UpdatedBoard1,UpdatedBoard2),
    checkTopRightDiagonal(1,Row,Column,UpdatedBoard2,UpdatedBoard3),
    checkRightRow(1,Row,Column,UpdatedBoard3,UpdatedBoard4),
    checkBottomRightDiagonal(1,Row,Column,UpdatedBoard4,UpdatedBoard5),
    checkBottomColumn(1,Row,Column,UpdatedBoard5,UpdatedBoard6),
    checkBottomLeftDiagonal(1,Row,Column,UpdatedBoard6,UpdatedBoard7),
    checkLefttRow(1,Row,Column,UpdatedBoard7,UpdatedBoard).


%Checks if the game is over
game_over(Board,Winner):- 
    (
        checkNumberPieces(8,6,6,1,Board),
        Winner is 1
    );
    (
        checkNumberPieces(8,6,6,2,Board),
        Winner is 2
    );
    (
        checkAll(Board,1),
        Winner is 1
    );
    (
        checkAll(Board,2),
        Winner is 2
    ); 
    Winner is 0.
