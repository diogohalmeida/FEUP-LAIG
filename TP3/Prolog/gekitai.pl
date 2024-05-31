:-consult('board.pl').
:-consult('display.pl').
:-consult('input.pl').
:-consult('game.pl').
:-consult('utils.pl').
:-consult('logic.pl').
:-consult('ai.pl').
:-use_module(library(lists)).
:-use_module(library(random)).
:-use_module(library(system)).


%Main predicate
play :-
    startMenu.