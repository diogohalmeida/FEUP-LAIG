%Reads where the player wants to play the piece and checks if that position is occupied.
%If it isn't it calls the predicate putPiece to execute the play. If it is, repeat the input
%After the play is done it also updates the next player to play.
playPiece(Player,Board, NextPlayer, UpdatedBoard) :-
    repeat,
        once(readColumn(Column)),
        once(readRow(Row)),
    move(Board,[Row,Column,Player],UpdatedBoard),
    player(Player,NextPlayer).      


%Places a piece on the board and calculates repulsions of adjacent pieces
move(GameState,Move,NewGameState):-
    nth0(0,Move,Row),
    nth0(1,Move,Column),
    nth0(2,Move,Player),
    checkOccupied(Column, Row, GameState),
    putPiece(GameState, Row, Column, Player, UpdatedBoard1),
    repulsion(Row, Column, UpdatedBoard1,NewGameState).
    

%Predicates that convert the user input to the number of the column
checkColumn('A', 1).
checkColumn('B', 2).
checkColumn('C', 3).
checkColumn('D', 4).
checkColumn('E', 5).
checkColumn('F', 6).
checkColumn(a, 1).
checkColumn(b, 2).
checkColumn(c, 3).
checkColumn(d, 4).
checkColumn(e, 5).
checkColumn(f, 6).
checkColumn(_Column, CheckedColumn) :-
    write('Invalid Column!\nSelect again:\n'),
    readColumn(CheckedColumn).

%Predicates that convert the user input to the number of the row
checkRow(1, 1).
checkRow(2, 2).
checkRow(3, 3).
checkRow(4, 4).
checkRow(5, 5).
checkRow(6, 6).
checkRow(_Row, CheckedRow) :-
    write('Invalid Row!\nSelect again:\n'),
    readRow(CheckedRow).

%Prompts user input for the row and reads it
readRow(CheckedRow) :-
    write('Row:\n'),
    read(Row),
    checkRow(Row, CheckedRow).


%Prompts user input for the column and reads it
readColumn(CheckedColumn) :-
    write('Column:\n'),
    read(Column),
    checkColumn(Column, CheckedColumn).

%Verifies if a cell is already occupied for another piece
%If it is repeat the input
checkOccupied(Column, Row, Board):-
    getSquarePiece(Column, Row, Content, Board),
    Content =:= 0.

checkOccupied(Column, Row, Board):-
    getSquarePiece(Column, Row, Content, Board),
    Content =:= 1,
    write('Square occupied by Black!\nSelect again:\n'),
    fail.

checkOccupied(Column, Row, Board):-
    getSquarePiece(Column, Row, Content, Board),
    Content =:= 2,
    write('Square occupied by Red!\nSelect again:\n'),
    fail.


%Reads a main menu option,verifies if its valid, if it is run the respective option, it it isn't repeat the input
readMenuOption:-
    repeat,
        write('Select the desired mode:\n'),
        once(read(Option)),
        checkMenuOption(Option),
    runOption(Option).


%Predicates that check every possible option on the main menu
checkMenuOption(0).
checkMenuOption(1).
checkMenuOption(2).
checkMenuOption(3).

checkMenuOption(_):-
    write('Invalid Option!\nTry Again:\n'),
    fail.


%Predicates that run the selected option's respective action
runOption(0):-
    write('\nExiting game...\n').

runOption(1):-
    start.

runOption(2):-
    printSecondaryMenu,
    repeat,
        write('Select the desired option:\n'),    
        once(read(Option)),
        checkSecondaryMenuOption(Option),
    runPlayerVComputerOption(Option).
    

runOption(3):-
    printSecondaryMenu,
    repeat,
        write('Select the desired option:\n'),
        once(read(Option)),
        checkSecondaryMenuOption(Option),
    runComputerVComputerOption(Option).


%Predicates that check every possible option on the difficulty menus
checkSecondaryMenuOption(0).
checkSecondaryMenuOption(1).
checkSecondaryMenuOption(2).

checkSecondaryMenuOption(_):-
    write('Invalid Option!\nTry Again:\n'),
    fail.


%Predicates that run the selected option's respective difficulty on the PlayerVComputer menu
runPlayerVComputerOption(0):-
    startMenu.

runPlayerVComputerOption(1):-
    gameLoop(p,b1).

runPlayerVComputerOption(2):-
    gameLoop(p,b2).


%Predicates that run the selected option's respective difficulty on the ComputerVComputer menu
runComputerVComputerOption(0):-
    startMenu.

runComputerVComputerOption(1):-
    gameLoop(b1,b1).

runComputerVComputerOption(2):-
    gameLoop(b2,b2).

