%Initial Board where every cell is emtpy
initialBoard([
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0],
    [0,0,0,0,0,0]
    ]).

%Shows the board to the user  
print_board(X):-
    nl,
    write('   | A | B | C | D | E | F |\n'),
    write('---|---|---|---|---|---|---|\n'),
    print_matrix(X,0).

%Predicates that print the matrix (board)
print_matrix([],6).

print_matrix([H|T],X):-
    X1 is X+1,
    write(X1),
    write('  |'),
    print_line(H),
    print_separation,
    nl,
    print_matrix(T,X1).

%Predicates that print every row of the board
print_line([]).
print_line([H|T]):-
    print_element(H),
    print_line(T).

%Prints the separator between rows 
print_separation:-
    nl,
    write('---|---|---|---|---|---|---|').

%Prints an element
print_element(X):-
    print_symbol(X,S),
    write(S),
    write(' |').

%Predicates that replace the internal representation of the pieces for the correct symbols in display 
print_symbol(2,' O').
print_symbol(1,' X').
print_symbol(0,'  ').

%Predicates that prints the main menu layout 
printMainMenu:-
    write('\n\n _______________________________________________________________________ \n'),
    write('|                                                                       |\n'),
    write('|                                                                       |\n'),
    write('|     _______  _______  _       __________________ _______ _________    |\n'),
    write('|    (  ____ \\(  ____ \\| \\    /\\\\__   __/\\__   __/(  ___  )\\__   __/    |\n'),
    write('|    | (    \\/| (    \\/|  \\  / /   ) (      ) (   | (   ) |   ) (       |\n'),
    write('|    | |      | (__    |  (_/ /    | |      | |   | (___) |   | |       |\n'),
    write('|    | | ____ |  __)   |   _ (     | |      | |   |  ___  |   | |       |\n'),
    write('|    | | \\_  )| (      |  ( \\ \\    | |      | |   | (   ) |   | |       |\n'),
    write('|    | (___) || (____/\\|  /  \\ \\___) (___   | |   | )   ( |___) (___    |\n'),
    write('|    (_______)(_______/|_/    \\/\\_______/   )_(   |/     \\|\\_______/    |\n'),
    write('|                                                                       |\n'),
    write('|                       _________________________                       |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 1. Player vs Player     |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 2. Player vs Computer   |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 3. Computer vs Computer |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 0. Exit                 |                      |\n'),
    write('|                      |_________________________|                      |\n'),
    write('|                                                                       |\n'),
    write('|_______________________________________________________________________|\n').

%Predicates that prints the difficulty menu layout
printSecondaryMenu:-
    write('\n\n _______________________________________________________________________ \n'),
    write('|                                                                       |\n'),
    write('|                                                                       |\n'),
    write('|     _______  _______  _       __________________ _______ _________    |\n'),
    write('|    (  ____ \\(  ____ \\| \\    /\\\\__   __/\\__   __/(  ___  )\\__   __/    |\n'),
    write('|    | (    \\/| (    \\/|  \\  / /   ) (      ) (   | (   ) |   ) (       |\n'),
    write('|    | |      | (__    |  (_/ /    | |      | |   | (___) |   | |       |\n'),
    write('|    | | ____ |  __)   |   _ (     | |      | |   |  ___  |   | |       |\n'),
    write('|    | | \\_  )| (      |  ( \\ \\    | |      | |   | (   ) |   | |       |\n'),
    write('|    | (___) || (____/\\|  /  \\ \\___) (___   | |   | )   ( |___) (___    |\n'),
    write('|    (_______)(_______/|_/    \\/\\_______/   )_(   |/     \\|\\_______/    |\n'),
    write('|                                                                       |\n'),
    write('|                       _________________________                       |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 1. Easy                 |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 2. Hard                 |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      | 0. Go Back              |                      |\n'),
    write('|                      |                         |                      |\n'),
    write('|                      |_________________________|                      |\n'),
    write('|                                                                       |\n'),
    write('|_______________________________________________________________________|\n').