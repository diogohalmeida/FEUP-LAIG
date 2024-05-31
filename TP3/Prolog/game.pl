:-dynamic(state/2).

%Represent the players
player(1,2).
player(2,1).

%Start the menu
startMenu:-
    printMainMenu,
    readMenuOption.

%Starts the game
start :-
    gameLoop(p,p).

%Sets up the initial board
initial(GameState) :-
    initialBoard(GameState).

%Displays the initial board and signals the next player's turn
display_game(GameState,Player):-
    print_board(GameState),
    (
        Player =:= 1,
        nl,
        write('Black Player Turn'),
        nl    
    );
    (
        Player =:= 2,
        nl,
        write('Red Player Turn'),
        nl    
    ).

%Implements the game loop, correctly assigning the turn for each player, updating the board and checking game over. 
%The game loop ends when the this predicate detects game over (game_over is true)
gameLoop(Mode1,Mode2):-
    initial(InitialBoard),
    assert(state(1,InitialBoard)),
    assert(mode(Mode1,Mode2)),
    repeat,
        retract(state(Player,Board)),
        retract(mode(FirstMode,SecondMode)),
        once(display_game(Board,Player)),
        once(playerMove(FirstMode,Player,Board,NextPlayer,UpdatedBoard)),
        assert(state(NextPlayer,UpdatedBoard)),
        assert(mode(SecondMode,FirstMode)),
        game_over(UpdatedBoard,Winner),
    print_board(UpdatedBoard),
    retract(state(_,_)),
    retract(mode(_,_)),
    endGame(Winner).


%Predicates that execute their respective functions depending on whether they're a player or a computer
playerMove(p,Player,Board,NextPlayer,UpdatedBoard):-
    once(playPiece(Player,Board,NextPlayer,UpdatedBoard)).

playerMove(b1,Player,Board,NextPlayer,UpdatedBoard):-
    sleep(1),
    choose_move(Board,Player,b1,Move),
    player(Player,NextPlayer),
    nth0(0,Move,RowChoosen),
    nth0(1,Move,ColumnChoosen),
    nth0(2,Move,UpdatedBoard),
    checkColumn(Column,ColumnChoosen),
    write('Pc Played in Column: '),
    write(Column),nl,
    write('Pc Played in Row: '),
    write(RowChoosen).

playerMove(b2,Player,Board,NextPlayer,UpdatedBoard):-
    choose_move(Board,Player,b2,Move),
    player(Player,NextPlayer),
    nth0(0,Move,RowChoosen),
    nth0(1,Move,ColumnChoosen),
    nth0(2,Move,UpdatedBoard),
    checkColumn(Column,ColumnChoosen),
    write('Pc Played in Column: '),
    write(Column),nl,
    write('Pc Played in Row: '),
    write(RowChoosen).


%Displays the result after ending the game
endGame(1):-
    write('Black Wins the Game\n'),
    startMenu.

endGame(2):-
    write('Red Wins the Game\n'),
    startMenu.

