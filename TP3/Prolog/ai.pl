%Predicates that handle all the moves made by the computer
choose_move(GameState,Player,b2,Move):-
    valid_moves(GameState,Player,ListBoards),
    pointsOfBoards(ListBoards,[],Player,FinalListOfBoards),
    selectBestBoards(-200,FinalListOfBoards,[],BestBoards),
    choose(BestBoards,Move).

choose_move(GameState,Player,b1,Move):-
    valid_moves(GameState,Player,ListUpdatedBoard),
    choose(ListUpdatedBoard,Move).
