
var tekst = $('#tekst');
var test1 = $('#test1');
var test2 = $('#test2');
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // beginstelling
//var fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/8/PPPP1PPP/RNBQKBNR w KQkq";
//var fen = "rnbqkbnr/pp1ppppp/8/2p5/4P3/2N5/PPPP1PPP/R1BQKBNR b KQkq - 0 2";
//var fen = "7k/8/8/8/8/1R6/4K3/8 w - - 0 1";
//var fen = "rnbqkbnr/pppppppp/8/8/4P3/8/PPPP1PPP/RNBQKBNR b KQkq - 0 1";

// values of static material
var pawnvalue = 100;
var knightvalue = 320;
var bishopvalue = 330;
var rookvalue = 505;
var queenvalue = 910;
var kingvalue = 20000;
var staticpiecevalue = 16*pawnvalue + 4*knightvalue + 4*bishopvalue + 4*rookvalue + 2*queenvalue;

var boardsquares = ["a8","b8","c8","d8","e8","f8","g8","h8",
                    "a7","b7","c7","d7","e7","f7","g7","h7",
                    "a6","b6","c6","d6","e6","f6","g6","h6",
                    "a5","b5","c5","d5","e5","f5","g5","h5",
                    "a4","b4","c4","d4","e4","f4","g4","h4",
                    "a3","b3","c3","d3","e3","f3","g3","h3",
                    "a2","b2","c2","d2","e2","f2","g2","h2",
                    "a1","b1","c1","d1","e1","f1","g1","h1"];

// values of activity per empty square it's looking at.
var ActiveKnightParameter 	= 2;
var ActiveBishopParameter 	= 2;
var ActiveRookSideParameter	= 1;
var ActiveRookUpParameter	= 2;
var ActiveQueenParameter	= 2;
var ActiveAttackParameter 	= 1; // small bonus is looking at enemy piece

// Main Evaluation Parameters
var MaterialParameter 		= 1;
var ActivityParameter		= 1;
var PieceSquareParameter	= 1;
var PawnStructureParameter	= 1;
var KingSafetyParamter		= 1;

// values of distance to king of different pieces
var knightDistance          = 0.1;
var bishopDistance          = [0.2, 0.15, 0.1, 0.05, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0];
var rookDistance            = 0.2;
var queenDistance           = 0.3;

var knighthop = new Array(-6,-15,-17,-10,6,15,17,10);
var knightsquares = [		
[6,7],[5,6,7],[4,5,6,7],[4,5,6,7],[4,5,6,7],[4,5,6,7],[4,5,6],[4,5],   
[0,6,7],[0,5,6,7],[0,3,4,5,6,7],[0,3,4,5,6,7],[0,3,4,5,6,7],[0,3,4,5,6,7],[3,4,5,6],[3,4,5],
[0,1,6,7],[0,1,2,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[1,2,3,4,5,6],[2,3,4,5],
[0,1,6,7],[0,1,2,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[1,2,3,4,5,6],[2,3,4,5],
[0,1,6,7],[0,1,2,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[1,2,3,4,5,6],[2,3,4,5],
[0,1,6,7],[0,1,2,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[0,1,2,3,4,5,6,7],[1,2,3,4,5,6],[2,3,4,5],
[0,1,7],[0,1,2,7],[0,1,2,3,4,7],[0,1,2,3,4,7],[0,1,2,3,4,7],[0,1,2,3,4,7],[1,2,3,4],[2,3,4],
[0,1],[0,1,2],[0,1,2,3],[0,1,2,3],[0,1,2,3],[0,1,2,3],[1,2,3],[2,3]
];
var bishopsquares = [
[0,0,0,7],[0,0,1,6],[0,0,2,5],[0,0,3,4],[0,0,4,3],[0,0,5,2],[0,0,6,1],[0,0,7,0],
[1,0,0,6],[1,1,1,6],[1,1,2,5],[1,1,3,4],[1,1,4,3],[1,1,5,2],[1,1,6,1],[0,1,6,0],
[2,0,0,5],[2,1,1,5],[2,2,2,5],[2,2,3,4],[2,2,4,3],[2,2,5,2],[1,2,5,1],[0,2,5,0],
[3,0,0,4],[3,1,1,4],[3,2,2,4],[3,3,3,4],[3,3,4,3],[2,3,4,2],[1,3,6,1],[0,3,4,0],
[4,0,0,3],[4,1,1,3],[4,2,2,3],[4,3,3,3],[3,4,3,3],[2,4,3,2],[1,4,6,1],[0,4,3,0],
[5,0,0,2],[5,1,1,2],[5,2,2,2],[4,3,2,2],[3,4,2,2],[2,5,2,2],[1,5,6,1],[0,5,2,0],
[6,0,0,1],[6,1,1,1],[5,2,1,1],[4,3,1,1],[3,4,1,1],[2,5,1,1],[1,6,6,1],[0,6,1,0],
[7,0,0,0],[6,1,0,0],[5,2,0,0],[4,3,0,0],[3,4,0,0],[2,5,0,0],[1,6,0,0],[0,7,0,0]
];

var kingsquares = [
[1,8,9],[-1,1,7,8,9],[-1,1,7,8,9],[-1,1,7,8,9],[-1,1,7,8,9],[-1,1,7,8,9],[-1,1,7,8,9],[-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-7,-1,1,7,8,9],[-9,-8,-1,7,8],
[-8,-7,1],[-1,1,-9,-8,-7],[-1,1,-9,-8,-7],[-1,1,-9,-8,-7],[-1,1,-9,-8,-7],[-1,1,-9,-8,-7],[-1,1,-9,-8,-7],[-9,-8,-1]
];

var pawntable = [
 0,  0,  0,  0,  0,  0,  0,  0,
50, 50, 50, 50, 50, 50, 50, 50,
10, 10, 20, 30, 30, 20, 10, 10,
 5,  5, 10, 25, 25, 10,  5,  5,
 0,  0,  0, 20, 20,  0,  0,  0,
 5, -5,-10,  0,  0,-10, -5,  5,
 5, 10, 10,-20,-20, 10, 10,  5,
 0,  0,  0,  0,  0,  0,  0,  0
];

var knighttable = [
-30,-20,-15,-15,-15,-15,-20,-30,
-20,-10,  0,  0,  0,  0,-10,-20,
-15,  0, 10, 15, 15, 10,  0,-15,
-15,  5, 15, 20, 20, 15,  5,-15,
-15,  0, 15, 20, 20, 15,  0,-15,
-15,  5, 10, 15, 15, 10,  5,-15,
-25,-10,  0,  5,  5,  0,-10,-20,
-30,-20,-30,-30,-30,-30,-20,-30
];

var bishoptable = [
-20,-10,-10,-10,-10,-10,-10,-20,
-10,  0,  0,  0,  0,  0,  0,-10,
-10,  0,  5, 10, 10,  5,  0,-10,
-10,  5,  5, 10, 10,  5,  5,-10,
-10,  0, 10, 10, 10, 10,  0,-10,
-10, 10, 10, 10, 10, 10, 10,-10,
-10,  5,  0,  0,  0,  0,  5,-10,
-20,-10,-10,-10,-10,-10,-10,-20
];

var rooktable = [
-20,-10,-10,-10,-10,-10,-10,-20,
-10,  0,  0,  0,  0,  0,  0,-10,
-10,  0,  5, 10, 10,  5,  0,-10,
-10,  5,  5, 10, 10,  5,  5,-10,
-10,  0, 10, 10, 10, 10,  0,-10,
-10, 10, 10, 10, 10, 10, 10,-10,
-10,  5,  0,  0,  0,  0,  5,-10,
-20,-10,-10,-10,-10,-10,-10,-20
];

var queentable = [
-20,-10,-10, -5, -5,-10,-10,-20,
-10,  0,  0,  0,  0,  0,  0,-10,
-10,  0,  5,  5,  5,  5,  0,-10,
 -5,  0,  5,  5,  5,  5,  0, -5,
  0,  0,  5,  5,  5,  5,  0, -5,
-10,  5,  5,  5,  5,  5,  0,-10,
-10,  0,  5,  0,  0,  0,  0,-10,
-20,-10,-10, -5, -5,-10,-10,-20
];

var kingtable = [
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-30,-40,-40,-50,-50,-40,-40,-30,
-20,-30,-30,-40,-40,-30,-30,-20,
-10,-20,-20,-20,-20,-20,-20,-10,
 20, 20,  0,  0,  0,  0, 20, 20,
 20, 30, 10,  0,  0, 10, 30, 20
];

var bishopsafetydiagup = [
   0, 1, 2, 3, 4, 5, 6, 7,
   1, 2, 3, 4, 5, 6, 7, 8,
   2, 3, 4, 5, 6, 7, 8, 9,
   3, 4, 5, 6, 7, 8, 9,10,
   4, 5, 6, 7, 8, 9,10,11,
   5, 6, 7, 8, 9,10,11,12,
   6, 7, 8, 9,10,11,12,13,
   7, 8, 9,10,11,12,13,14
];

var bishopsafetydiagdown = [
   7, 6, 5, 4, 3, 2, 1, 0,
   8, 7, 6, 5, 4, 3, 2, 1,
   9, 8, 7, 6, 5, 4, 3, 2,
  10, 9, 8, 7, 6, 5, 4, 3,
  11,10, 9, 8, 7, 6, 5, 4,
  12,11,10, 9, 8, 7, 6, 5,
  13,12,11,10, 9, 8, 7, 6,
  14,13,12,11,10, 9, 8, 7
];

var kingShieldValue = [1,2,1,2,4,2,5,6,4,2,0,2,1,1,1];
var kingShieldLoc = [   -25,-24,-23, 
                        -17,-16,-15,
                        -9 , -8, -7,
                        -1 ,  0, -1,
                         7 ,  8,  9   ];



var board = Fen2Board();

function setCharAt(str,index,chr) {
	if(index > str.length-1) return str;
    var startofstr = str.substr(0,index);
    var endofstr = str.substring(index+1);
    
	return startofstr + chr + endofstr;
}

function ChessMove(move) {
    var chessMove = 1;
    return chessMove;
}



function MakeMove(board,move) {
    var tempchess = new Chess("fen");
    var fromSquare = move.split("-").shift();
    var toSquare = move.split("-").pop();
    
    tempchess.move({from: boardsquares[fromSquare], to: boardsquares[toSquare] });
    board = Fen2Board(tempchess.fen());
    
    return board;
}


function FindBestMove(board) {
    var horizon = 1;
    var movescore = new Array();
    posmoves = FindPossibleMoves(board);
    
    for (var i=0 ; i<posmoves.length ; i++ ) {
        newboard = MakeMove(board,posmoves[i]);
        movescore.push(Eval(newboard));
    }
    var iMax,x,i;
    var indexOfMaxMoveScore = movescore.reduce((iMax, x, i, movescore) => x > movescore[iMax] ? i : iMax, 0);
    var bestMove = posmoves[indexOfMaxMoveScore];
    return bestMove;
}



function FindPossibleMoves(board) {
    var posmoves = new Array();
    
    for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		//if white is to move, find possible moves for white
        if ( Ply()%2===0 ) {
            switch (board.charAt(boardcounter)) {
            case "P":
                //advance pawn by one square
                if ( board.charAt( boardcounter-8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter-8));
                }
                //check for capture right if not on h-file
                if ( boardcounter%8!==7 && "rnbqkp".includes(board.charAt(boardcounter-7)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter-7));
                }
                //check for capture left if not on a-file
                if ( boardcounter%8!==0 && "rnbqkp".includes(board.charAt(boardcounter-9)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter-9));
                }
                //advance pawn by two squares if at starting pos and pos in front is empty
                if ( 7-Math.floor(boardcounter/8)===1 && board.charAt( boardcounter-16)==="e" && board.charAt( boardcounter-8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter-16));
                }               
                break;
            case "N": 
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if ( "ernbqkp".includes(board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
						//add move to possible moves
                        posmoves.push(boardcounter + '-' + (boardcounter+knighthop[knightsquares[boardcounter][i]]));
					}
                    else {
                        block = true;
                    }
				}
                break;
            case "B":
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 ) {
                            if (board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                            }
                            else if ( "rnbqkp".includes( board.charAt( boardcounter-(7*(j+1)) ) ) ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//up left
						else if ( i===1 ) {
                            if ( board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter-(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        //down left
						else if ( i===2) {
                            if (board.charAt( boardcounter+(7*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter+(7*(j+1))))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//down right
						else if ( i===3 ) {
                            if (board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter+(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        j++;
					}	
				}
                break;
            case "R":
                var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 ) {
                            if (board.charAt( boardcounter + (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter + (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//up
                        if ( i===1 ) {
                            if (board.charAt( boardcounter -(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter -(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//left
                        if ( i===2 ) {
                            if (board.charAt( boardcounter - (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter - (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//down
                        if ( i===3 ) {
                            if (board.charAt( boardcounter +(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter +(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						j++;
					}	
				}
                break;
            case "Q":
                var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 ) {
                            if (board.charAt( boardcounter + (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter + (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//up
                        if ( i===1 ) {
                            if (board.charAt( boardcounter -(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter -(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//left
                        if ( i===2 ) {
                            if (board.charAt( boardcounter - (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter - (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//down
                        if ( i===3 ) {
                            if (board.charAt( boardcounter +(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                            }
                            else if ("rnbqkp".includes(board.charAt(( boardcounter +(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						j++;
					}	
				}
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 ) {
                            if (board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                            }
                            else if ( "rnbqkp".includes( board.charAt( boardcounter-(7*(j+1)) ) ) ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//up left
						else if ( i===1 ) {
                            if ( board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter-(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        //down left
						else if ( i===2) {
                            if (board.charAt( boardcounter+(7*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter+(7*(j+1))))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//down right
						else if ( i===3 ) {
                            if (board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                            }
                            else if ( "rnbqkp".includes(board.charAt( boardcounter+(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        j++;
					}	
				}
                break;
            case "K":
                for (var i=0 ; i<kingsquares[boardcounter].length ; i++) {
                    if ("ernbqkp".includes(board.charAt(boardcounter+kingsquares[boardcounter][i]))) {
                        posmoves.push(boardcounter + '-' + (boardcounter+kingsquares[boardcounter][i]));
                    }
                }
                break;
            }
        }
        //if black is to move, find possible moves for black
        else if ( Ply()%2===1 ) {
            switch (board.charAt(boardcounter)) {
            case "p":
                //advance pawn by one square
                if ( board.charAt( boardcounter+8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter+8));
                }
                //check for capture right if not on h-file
                if ( boardcounter%8!==7 && "RNBQKP".includes(board.charAt(boardcounter+9)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter+9));
                }
                //check for capture left if not on a-file
                if ( boardcounter%8!==0 && "RNBQKP".includes(board.charAt(boardcounter+7)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter+7));
                }
                //advance pawn by two squares if at starting pos and pos in front is empty
                if ( Math.floor(boardcounter/8)===1 && board.charAt( boardcounter+16)==="e" && board.charAt( boardcounter+8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter+16));
                }               
                break;
            case "n": 
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if ( "eRNBQKP".includes(board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
						//add move to possible moves
                        posmoves.push(boardcounter + '-' + (boardcounter+knighthop[knightsquares[boardcounter][i]]));
					}
                    else {
                        block = true;
                    }
				}
                break;
            case "b":
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 ) {
                            if (board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                            }
                            else if ( "RNBQKP".includes( board.charAt( boardcounter-(7*(j+1)) ) ) ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//up left
						else if ( i===1 ) {
                            if ( board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter-(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        //down left
						else if ( i===2) {
                            if (board.charAt( boardcounter+(7*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter+(7*(j+1))))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//down right
						else if ( i===3 ) {
                            if (board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter+(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        j++;
					}	
				}
                break;
            case "r":
                var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 ) {
                            if (board.charAt( boardcounter + (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter + (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//up
                        if ( i===1 ) {
                            if (board.charAt( boardcounter -(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter -(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//left
                        if ( i===2 ) {
                            if (board.charAt( boardcounter - (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter - (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//down
                        if ( i===3 ) {
                            if (board.charAt( boardcounter +(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter +(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						j++;
					}	
				}
                break;
            case "q":
                var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 ) {
                            if (board.charAt( boardcounter + (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter + (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//up
                        if ( i===1 ) {
                            if (board.charAt( boardcounter -(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter -(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//left
                        if ( i===2 ) {
                            if (board.charAt( boardcounter - (j+1) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter - (j+1) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(j+1)));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						//down
                        if ( i===3 ) {
                            if (board.charAt( boardcounter +(8*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                            }
                            else if ("RNBQKP".includes(board.charAt(( boardcounter +(8*(j+1)) )))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(8*(j+1))));
                                block = true;
                            }
                            else {
                                block = true;
                            }
						}
						j++;
					}	
				}
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 ) {
                            if (board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                            }
                            else if ( "RNBQKP".includes( board.charAt( boardcounter-(7*(j+1)) ) ) ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//up left
						else if ( i===1 ) {
                            if ( board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter-(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter-(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        //down left
						else if ( i===2) {
                            if (board.charAt( boardcounter+(7*(j+1)) ) === "e") {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter+(7*(j+1))))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(7*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
						//down right
						else if ( i===3 ) {
                            if (board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                            }
                            else if ( "RNBQKP".includes(board.charAt( boardcounter+(9*(j+1)) ))) {
                                posmoves.push(boardcounter + '-' + (boardcounter+(9*(j+1))) );
                                block = true;
                            }
                            else {
                                block = true;
                            }
                        }
                        j++;
					}	
				}
                break;
            case "k":
                for (var i=0 ; i<kingsquares[boardcounter].length ; i++) {
                    if ("eRNBQKP".includes(board.charAt(boardcounter+kingsquares[boardcounter][i]))) {
                        posmoves.push(boardcounter + '-' + (boardcounter+kingsquares[boardcounter][i]));
                    }
                }
                break;
            }
        }
    }   
    return posmoves;
}




function Eval (board) {
	
	var score 	= MaterialParameter     * MaterialScore(board)
                + ActivityParameter		* ActivityScore(board)
                + PieceSquareParameter	* PieceSquareScore(board)
                + KingSafetyParamter    * KingSafetyScore(board);
                + PawnStructureParameter* PawnStructureScore(board);

	return score;	
}



function Fen2Board() {
	
	var board = "";
	var fenshort = fen.substring(0, fen.indexOf(' '));
	for (var fenstring=0; fenstring<fenshort.length; fenstring++) {
		switch (fenshort.charAt(fenstring)) {
			case "k": board = board + "k"; break;
			case "q": board = board + "q"; break;
			case "r": board = board + "r"; break;
			case "b": board = board + "b"; break;
			case "n": board = board + "n"; break;
			case "p": board = board + "p"; break;
			case "K": board = board + "K"; break;
			case "Q": board = board + "Q"; break;
			case "R": board = board + "R"; break;
			case "B": board = board + "B"; break;
			case "N": board = board + "N"; break;
			case "P": board = board + "P"; break;
			case "1": board = board + "e"; break;
			case "2": board = board + "ee"; break;
			case "3": board = board + "eee"; break;
			case "4": board = board + "eeee"; break;
			case "5": board = board + "eeeee"; break;
			case "6": board = board + "eeeeee"; break;
			case "7": board = board + "eeeeeee"; break;
			case "8": board = board + "eeeeeeee"; break;
		}
	}
	return board;
}


// returns the material score of all pieces: + is white ahead, - is black ahead
function MaterialScore (board) {
	var score = 0;
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		switch (board.charAt(boardcounter)) {
			case "k": score -= kingvalue; 	break;
			case "q": score -= queenvalue;	break;
			case "r": score -= rookvalue; 	break;
			case "b": score -= bishopvalue; break;
			case "n": score -= knightvalue; break;
			case "p": score -= pawnvalue; 	break;
			case "K": score += kingvalue; 	break;
			case "Q": score += queenvalue; 	break;
			case "R": score += rookvalue;	break;
			case "B": score += bishopvalue;	break;
			case "N": score += knightvalue;	break;
			case "P": score += pawnvalue; 	break;
		}
	}
	return score;
}

//add or substract score for pieces standing on certain squares.
function PieceSquareScore (board) {
	var score = 0;	
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		switch (board.charAt(boardcounter)) {
			case "k": score -= kingtable[63-boardcounter]; 		break;
			case "q": score -= queentable[63-boardcounter];		break;
			case "r": score -= rooktable[63-boardcounter]; 		break;
			case "b": score -= bishoptable[63-boardcounter]; 	break;
			case "n": score -= knighttable[63-boardcounter]; 	break;
			case "p": score -= pawntable[63-boardcounter]; 		break;
			case "K": score += kingtable[boardcounter]; 		break;
			case "Q": score += queentable[boardcounter]; 		break;
			case "R": score += rooktable[boardcounter];			break;
			case "B": score += bishoptable[boardcounter];		break;
			case "N": score += knighttable[boardcounter];		break;
			case "P": score += pawntable[boardcounter]; 		break;
		}
	}
	return score;
}

function KingSafetyScore (board) {
	var kingSafety = [0,0]; //safety of white and black king

	
    //vind eerst positie beide koningen.
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
        if (board.charAt(boardcounter)=== "K") {
            var whiteKingLoc = boardcounter;
        }
        else if (board.charAt(boardcounter)=== "k") {
            var blackKingLoc = boardcounter;
        }
	}
    
    //factor 1: PieceDistance
    for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
       	switch (board.charAt(boardcounter)) {
			case "q": kingSafety[0] += queenDistance * PieceDistance(whiteKingLoc,boardcounter); 	break;
			case "r": kingSafety[0] += rookDistance * PieceDistance(whiteKingLoc,boardcounter); 	break;
			case "b": kingSafety[0] += bishopDistance[ Math.abs( bishopsafetydiagup[whiteKingLoc] - bishopsafetydiagup[boardcounter] ) ];
                      kingSafety[0] += bishopDistance[ Math.abs( bishopsafetydiagdown[whiteKingLoc] - bishopsafetydiagdown[boardcounter] ) ];break;
			case "n": kingSafety[0] += knightDistance * PieceDistance(whiteKingLoc,boardcounter); break;
            
            case "Q": kingSafety[1] -= queenDistance * PieceDistance(blackKingLoc,boardcounter); 	break;
			case "R": kingSafety[1] -= rookDistance * PieceDistance(blackKingLoc,boardcounter); 	break;
			case "B": kingSafety[1] -= bishopDistance[ Math.abs( bishopsafetydiagup[blackKingLoc] - bishopsafetydiagup[boardcounter] ) ];
                      kingSafety[1] -= bishopDistance[ Math.abs( bishopsafetydiagdown[blackKingLoc] - bishopsafetydiagdown[boardcounter] ) ];break;
			case "N": kingSafety[1] -= knightDistance * PieceDistance(blackKingLoc,boardcounter); break;
        }
    }
	
	//factor 2: pionnenschild voor de koning.   
    var whiteKingCol = whiteKingLoc%8;
                  
    if (whiteKingCol===0) {
        for (i=0 ; i<15 ; i++) {
            if (i%3!==0 && board.charAt(whiteKingLoc + kingShieldLoc[i])==="P") {
                    kingSafety[0] += kingShieldValue[i];
            }
        }
    }
    else if (whiteKingCol===7) {
        for (i=0 ; i<15 ; i++) {
            if (i%3!==2 && board.charAt(whiteKingLoc + kingShieldLoc[i])==="P") {
                    kingSafety[0] += kingShieldValue[i];
            }
        }
    }
    else {      
        for (i=0 ; i<15 ; i++) {           
            if ( board.charAt(whiteKingLoc + kingShieldLoc[i])==="P") {
                kingSafety[0] += kingShieldValue[i];
            }
        }       
    }
    
    var blackKingCol = blackKingLoc%8;
    
    if (blackKingCol===0) {
        for (i=0 ; i<15 ; i++) {          
            if ( i%3 !==2 && board.charAt(blackKingLoc - kingShieldLoc[i])==="p") {
                kingSafety[1] -= kingShieldValue[i];
            }
        }
    }
    else if (blackKingCol===7) {
        for (i=0 ; i<15 ; i++) {
            if ( i%3 !==0 && board.charAt(blackKingLoc - kingShieldLoc[i])==="p") {
                kingSafety[1] -= kingShieldValue[i];
            }
        }
    }
    else {
        for (i=0 ; i<15 ; i++) {
            if ( board.charAt(blackKingLoc - kingShieldLoc[i])==="p") {
                kingSafety[1] -= kingShieldValue[i];
            }
        }
    }
    
    
    // kingsafety becomes less important with fewer pieces on the board.
    test1.html(kingSafety[0] + ' ' + kingSafety[1]);
	var score = Math.round( (kingSafety[0]+kingSafety[1]) * ( PieceValueCount(board) / staticpiecevalue ) ); 
	
	return score;
}

function PawnStructureScore (board) {
    var score = 0;
    
    return score;
}


// evaluate a score for the mobility of pieces: knight bishop rook and queen
// TODO: als je geblokt wordt door vijandig stuk, kleine score bonus: ActiveAttackParameter. Werkt nu alleen nog voor paard. Chique manier verzinnen om dat bij andere stukken te doen.
function ActivityScore (board) {
	var score = 0;
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		switch (board.charAt(boardcounter)) {
			case "N": 
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if (board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])==="e") {
						score += ActiveKnightParameter;
					}
					// add a small score if blocking piece is black
					else if ( "rnbqkp".includes(board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
						score += ActiveAttackParameter;
					}
				}
			break;
			case "n":
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if (board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])==="e") {
						score -= ActiveKnightParameter;
					}
					// subtract a small score if blocking piece is white
					else if ( "RNBQKP".includes(board.charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
						score -= ActiveAttackParameter;
					}
				}
			break;
			case "B":
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 && board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
							score += ActiveBishopParameter;
						}
						//up left
						else if ( i===1 && board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
							score += ActiveBishopParameter;
						}
						//down left
						else if ( i===2 && board.charAt( boardcounter+(7*(j+1)) ) === "e" ) {
							score += ActiveBishopParameter;
						}
						//down right
						else if ( i===3 && board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
							score += ActiveBishopParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}
			break;
			case "b":
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 && board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
							score -= ActiveBishopParameter;
						}
						//up left
						else if ( i===1 && board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
							score -= ActiveBishopParameter;
						}
						//down left
						else if ( i===2 && board.charAt( boardcounter+(7*(j+1)) ) === "e" ) {
							score -= ActiveBishopParameter;
						}
						//down right
						else if ( i===3 && board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
							score -= ActiveBishopParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}
			break;
			case "R":
				var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 && board.charAt( boardcounter + (j+1) ) === "e") {
							score += ActiveRookSideParameter;
						}
						//up
						else if ( i===1 && board.charAt( boardcounter-(8*(j+1)) ) === "e" ) {
							score += ActiveRookUpParameter;
						}
						//left
						else if ( i===2 && board.charAt( boardcounter - (j+1) ) === "e" ) { //let op de haakjes: - (j+1) is goed
							score += ActiveRookSideParameter;
						}
						//down
						else if ( i===3 && board.charAt( boardcounter+(8*(j+1)) ) === "e" ) {
							score += ActiveRookSideParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}	
			break;
			case "r":
				var rooksquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<rooksquares[i] && !block) {
						//right
						if ( i===0 && board.charAt( boardcounter + (j+1) ) === "e") {
							score -= ActiveRookSideParameter;
						}
						//up
						else if ( i===1 && board.charAt( boardcounter-(8*(j+1)) ) === "e" ) {
							score -= ActiveRookSideParameter;
						}
						//left
						else if ( i===2 && board.charAt( boardcounter - (j+1) ) === "e" ) { //let op de haakjes: - (j+1) is goed
							score -= ActiveRookSideParameter;
						}
						//down
						else if ( i===3 && board.charAt( boardcounter+(8*(j+1)) ) === "e" ) {
							score -= ActiveRookUpParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}	
			break;
			case "Q":
				var queensquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				//horizontal and vertical queenlines
							for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<queensquares[i] && !block) {
						//right
						if ( i===0 && board.charAt( boardcounter + (j+1) ) === "e") {
							score += ActiveQueenParameter;
						}
						//up
						else if ( i===1 && board.charAt( boardcounter-(8*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						//left
						else if ( i===2 && board.charAt( boardcounter - (j+1) ) === "e" ) { //let op de haakjes: - (j+1) is goed
							score + ActiveQueenParameter;
						}
						//down
						else if ( i===3 && board.charAt( boardcounter+(8*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}
				//diagonal queenlines
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 && board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						//up left
						else if ( i===1 && board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						//down left
						else if ( i===2 && board.charAt( boardcounter+(7*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						//down right
						else if ( i===3 && board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
							score += ActiveQueenParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}	
			break;
			case "q":
				var queensquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				//horizontal and vertical queenlines
							for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<queensquares[i] && !block) {
						//right
						if ( i===0 && board.charAt( boardcounter + (j+1) ) === "e") {
							score -= ActiveQueenParameter;
						}
						//up
						else if ( i===1 && board.charAt( boardcounter-(8*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						//left
						else if ( i===2 && board.charAt( boardcounter - (j+1) ) === "e" ) { //let op de haakjes: - (j+1) is goed
							score -= ActiveQueenParameter;
						}
						//down
						else if ( i===3 && board.charAt( boardcounter+(8*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}
				//diagonal queenlines
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {
						//up right
						if ( i===0 && board.charAt( boardcounter-(7*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						//up left
						else if ( i===1 && board.charAt( boardcounter-(9*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						//down left
						else if ( i===2 && board.charAt( boardcounter+(7*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						//down right
						else if ( i===3 && board.charAt( boardcounter+(9*(j+1)) ) === "e" ) {
							score -= ActiveQueenParameter;
						}
						else {
							block = true;
						}
						j++;
					}	
				}	
			break;
		}	
	}
	return score;	
}

$('#Btn').on('click', function() {
tekst.html(	
			'<br> Materiaal Score: ' + MaterialScore(board) + 
			'<br> Activiteit Score:  ' + ActivityScore(board) + 
			'<br> PieceSquare Score: ' + PieceSquareScore(board) +
            '<br> KingSafety Score: ' + KingSafetyScore(board) +
            '<br> PawnStructure Score: ' + PawnStructureScore(board) +
			'<br> Aantal velden op bord: ' + board.length + 
			'<br> FEN:  ' + fen + 
			'<br>Bord: ' + board +
			'<br> Aantal stukken: ' + PieceCount(board) + 
            '<br>Fase: ' + PieceValueCount(board) + ' / ' + staticpiecevalue +
			'<br>Overall eval: ' + Eval(board) +
            '<br>Ply: ' + Ply() +
            '<br>Possible moves: ' + FindPossibleMoves(board) +
            '<br>Best move: ' + FindBestMove(board)            
			);
});


// 0 is beginstelling, even is wit aan zet, odd zwart aan zet.
function Ply() {
    var ply = 0;
    if (fen.includes("w")) {
        //do nothing
    }
    else {
        ply++;
    }
	ply = +ply + 2*((+fen.split(" ").pop())-1) ;
	return ply;
}


	
//bepaal totaal aantal stukken op bord
function PieceCount(board) {
	var count = 0;
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		switch (board.charAt(boardcounter)) {
			case "k":
			case "q":
			case "r":
			case "b":
			case "n":
			case "p":
			case "K":
			case "Q":
			case "R":
			case "B":
			case "N":
			case "P":
				count++;
		}
	}
	return count;
}

//bepaal totaal waarde stukken op bord minus de koningen
function PieceValueCount(board) {
	var value = 0;
	for ( var boardcounter=0; boardcounter<board.length ; boardcounter++ ) {
		switch (board.charAt(boardcounter)) {

			case "Q":
			case "q":
						value += queenvalue;
						break;
			case "R":
			case "r":
						value += rookvalue;
						break;
			case "N":
			case "n":
						value += knightvalue;
						break;
			case "B":
			case "b":
						value += bishopvalue;
						break;
			case "P":
			case "p":
						value += pawnvalue;
						break;
		}
	}
	return value;
}

function PieceDistance (loc1,loc2) {
    // distance = row difference + col difference
    var distance = Math.abs(Math.floor(loc1/8)-Math.floor(loc2/8)) + Math.abs((loc1%8)-(loc2%8));    
    return distance;
}
