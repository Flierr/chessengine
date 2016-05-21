/*
 * V 1.0.3 of Flier's javascript chess engine.
 * Author: Yorrick Vissers
 * Github: https://github.com/Flierr/chessengine
 * TODO: 1) Negamax Search 2) Improve FindPossibleMoves to use chess.js .moves() functionality and simplify. 3) Refactor to Negamax / Alphabeta search
 * Known limitations and bugs: Does not include any form of pawn promotion, will be solved by using chess.js .moves() functionality.
 */
var tekst = $('#tekst');
var test1 = $('#test1');
var test2 = $('#test2');
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // starting position fen
//var fen = "rnbqkbnr/pppp1ppp/8/4p3/4P3/8/PPPP1PPP/RNBQKBNR w KQkq - 0 2"; //testing position fen
var board = Fen2Board(fen);

$('#Btn').on('click', function() {
tekst.html(	
			'<br> Material Score: ' + MaterialScore(board) + 
			'<br> Activity Score:  ' + ActivityScore(board) + 
			'<br> PieceSquare Score: ' + PieceSquareScore(board) +
            '<br> KingSafety Score: ' + KingSafetyScore(board) +
            '<br> PawnStructure Score: ' + PawnStructureScore(board) +
			'<br> FEN:  ' + fen + 
			'<br>Board: ' + board[0] +
			'<br>Piece Count: ' + PieceCount(board) + 
            '<br>Fase: ' + PieceValueCount(board) + ' / ' + staticpiecevalue +
			'<br>Overall eval: ' + Eval(board) +
            '<br>Possible moves: ' + FindPossibleMoves(board) +
            '<br>Nr Pos moves: ' + FindPossibleMoves(board).length +
            '<br>Best move: ' + FindBestMove(board)  +
            '<br>Negamax: ' + PlayBestMove(board)
			);
});


function MakeMove(board,move) {
    var tempchess = new Chess(fen);
    var fromSquare = move.split("-").shift();
    var toSquare = move.split("-").pop();
    //check for kingside castle
    if ( (fromSquare === 60 && toSquare ===62 && board[2].includes("K")) || (fromSquare === 4 && toSquare === 6 && board[2].includes("k")) ) {
        tempchess.move('O-O');
    } 
    //check if move is queenside castle
    else if ( (fromSquare === 60 && toSquare ===58 && board[2].includes("Q")) || (fromSquare === 4 && toSquare === 2 && board[2].includes("q")) ) {
        tempchess.move('O-O-O');
    }
    //normal moves
    else {    
        tempchess.move({from: boardsquares[fromSquare], to: boardsquares[toSquare] });
    }
    board = Fen2Board(tempchess.fen());
    result = [board,tempchess];
    return result;
}
function UnMakeMove(board,tempchess) {
    tempchess.undo();
    board = Fen2Board(tempchess.fen());
    return board;
}


function FindBestMove(board) {
    
    var movescore = new Array();
    posmoves = FindPossibleMoves(board);
    
    for (var i=0 ; i<posmoves.length ; i++ ) {
        var newboard = MakeMove(board,posmoves[i]);
        movescore.push(Eval(newboard[0]));
    }
    var iMax,x,i;
    var indexOfMaxMoveScore = movescore.reduce((iMax, x, i, movescore) => x > movescore[iMax] ? i : iMax, 0);
    var bestMove = posmoves[indexOfMaxMoveScore];
    return movescore;
}


function FindPossibleMoves(board) {
    var posmoves = new Array();
    
    //if white is to move, find possible moves for white
    if ( board[1]===1 ) {
        //check enpassent move
        if (board[3]!=='-') {
            var epSquare = boardsquares.indexOf(board[3]);
            //check for capture right if epsquare is not on a-file
            if ( epSquare !==0 && board[0].charAt(epSquare+7)==="P") {
                posmoves.push((epSquare+7) + '-' + epSquare);
            }
            //check for capture left if epsquare is not on a-file
            if (epSquare !==7 && board[0].charAt(epSquare+9)==="P") {
                posmoves.push((epSquare+9) + '-' + epSquare);
            }
        }
        for ( var boardcounter=0; boardcounter<board[0].length ; boardcounter++ ) {
            switch (board[0].charAt(boardcounter)) {
            case "P":
                //advance pawn by one square
                if ( board[0].charAt( boardcounter-8)==="e") {
                    posmoves.push( boardcounter + '-' + (boardcounter-8));
                }
                //check for capture right if not on h-file
                if ( boardcounter%8!==7 && "rnbqkp".includes(board[0].charAt(boardcounter-7)) ) {
                    posmoves.push( boardcounter + '-' + (boardcounter-7));
                }
                //check for capture left if not on a-file
                if ( boardcounter%8!==0 && "rnbqkp".includes(board[0].charAt(boardcounter-9)) ) {
                    posmoves.push( boardcounter + '-' + (boardcounter-9));
                }
                //advance pawn by two squares if at starting pos and pos in front is empty
                if ( 7-Math.floor(boardcounter/8)===1 && board[0].charAt( boardcounter-16)==="e" && board[0].charAt( boardcounter-8)==="e") {
                    posmoves.push( boardcounter + '-' + (boardcounter-16));
                }               
                break;
            case "N": 
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if ( "ernbqkp".includes(board[0].charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
						//add move to possible moves
                        posmoves.push( boardcounter + '-' + (boardcounter+knighthop[knightsquares[boardcounter][i]]) );
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
                        if (board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                        }
                        else if ( "rnbqkp".includes( board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                            block = true;
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
						if (board[0].charAt( boardcounter +(rookDirection[i]*(j+1)) ) === "e") {
                            posmoves.push( boardcounter + '-' + (boardcounter +(rookDirection[i]*(j+1))) );
                        }
                        else if ("rnbqkp".includes(board[0].charAt(boardcounter +(rookDirection[i]*(j+1)))) ) {
                            posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            block = true;
                        }
                        else {
                            block = true;
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
						if (board[0].charAt( boardcounter +(rookDirection[i]*(j+1)) ) === "e") {
                            posmoves.push( boardcounter + '-' + (boardcounter +(rookDirection[i]*(j+1))) );
                        }
                        else if ("rnbqkp".includes(board[0].charAt(boardcounter +(rookDirection[i]*(j+1)))) ) {
                            posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            block = true;
                        }
                        else {
                            block = true;
                        }
						j++;
					}	
				}
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {                       
                        if (board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                        }
                        else if ( "rnbqkp".includes( board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                            block = true;
                        }
                        else {
                            block = true;
                        }
                        j++;
					}	
				}
                break;
            case "K":
                for (var i=0 ; i<kingsquares[boardcounter].length ; i++) {
                    if ("ernbqkp".includes(board[0].charAt(boardcounter+kingsquares[boardcounter][i]))) {
                        posmoves.push(boardcounter + '-' + (boardcounter+kingsquares[boardcounter][i]));
                    }
                }
                //check if castling is a possible move
                if (board[2].includes("K") && board[0].charAt(61)==="e" && board[0].charAt(62)==="e") {
                    posmoves.push(60 + '-' + 62);
                }
                else if (board[2].includes("Q") && board[0].charAt(59)==="e" && board[0].charAt(58)==="e" && board[0].charAt(57)==="e") {
                    posmoves.push(60 + '-' + 58);
                }
                break;
            }
        }
    }
        //if black is to move, find possible moves for black
    else if ( board[1]===-1 ) {
        if (board[3]!=='-') {
            var epSquare = boardsquares.indexOf(board[3]);
            //check for capture right if epsquare is not on a-file
            if ( epSquare !==0 && board[0].charAt(epSquare-9)==="p") {
                posmoves.push((epSquare-9) + '-' + epSquare);
            }
            //check for capture left if epsquare is not on a-file
            if (epSquare !==7 && board[0].charAt(epSquare-7)==="p") {
                posmoves.push((epSquare-7) + '-' + epSquare);
            }
        }
        for ( var boardcounter=0; boardcounter<board[0].length ; boardcounter++ ) {
            switch (board[0].charAt(boardcounter)) {
            case "p":
                //advance pawn by one square
                if ( board[0].charAt( boardcounter+8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter+8));
                }
                //check for capture right if not on h-file
                if ( boardcounter%8!==7 && "RNBQKP".includes(board[0].charAt(boardcounter+9)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter+9));
                }
                //check for capture left if not on a-file
                if ( boardcounter%8!==0 && "RNBQKP".includes(board[0].charAt(boardcounter+7)) ) {
                    posmoves.push(boardcounter + '-' + (boardcounter+7));
                }
                //advance pawn by two squares if at starting pos and pos in front is empty
                if ( Math.floor(boardcounter/8)===1 && board[0].charAt( boardcounter+16)==="e" && board[0].charAt( boardcounter+8)==="e") {
                    posmoves.push(boardcounter + '-' + (boardcounter+16));
                }               
                break;
            case "n": 
				for (var i=0 ; i<knightsquares[boardcounter].length ; i++) {
					if ( "eRNBQKP".includes(board[0].charAt(boardcounter+knighthop[knightsquares[boardcounter][i]])) ) {
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
                        if (board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                        }
                        else if ( "RNBQKP".includes( board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                            block = true;
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
						if (board[0].charAt( boardcounter +(rookDirection[i]*(j+1)) ) === "e") {
                            posmoves.push( boardcounter + '-' + (boardcounter +(rookDirection[i]*(j+1))) );
                        }
                        else if ("RNBQKP".includes(board[0].charAt(boardcounter +(rookDirection[i]*(j+1)))) ) {
                            posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            block = true;
                        }
                        else {
                            block = true;
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
						if (board[0].charAt( boardcounter +(rookDirection[i]*(j+1)) ) === "e") {
                            posmoves.push( boardcounter + '-' + (boardcounter +(rookDirection[i]*(j+1))) );
                        }
                        else if ("RNBQKP".includes(board[0].charAt(boardcounter +(rookDirection[i]*(j+1)))) ) {
                            posmoves.push(boardcounter + '-' + (boardcounter+(j+1)));
                            block = true;
                        }
                        else {
                            block = true;
                        }
						j++;
					}	
				}
                for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<bishopsquares[boardcounter][i] && !block) {                       
                        if (board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                        }
                        else if ( "RNBQKP".includes( board[0].charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            posmoves.push( boardcounter + '-' + (boardcounter+(bishopDirection[i]*(j+1))) );
                            block = true;
                        }
                        else {
                            block = true;
                        }
                        j++;
					}	
				}
                break;
            case "k":
                for (var i=0 ; i<kingsquares[boardcounter].length ; i++) {
                    if ("eRNBQKP".includes(board[0].charAt(boardcounter+kingsquares[boardcounter][i]))) {
                        posmoves.push(boardcounter + '-' + (boardcounter+kingsquares[boardcounter][i]));
                    }
                }
                break;
            }
        }
    }   
    return posmoves;
}


function Fen2Board(fen) {
    
    var fenSplit = fen.split(" ");

	var boardstring = "";
	for (var fenstring=0; fenstring<fenSplit[0].length; fenstring++) {
        if ("kqrbnpKQRBNP".includes(fenSplit[0].charAt(fenstring))) {
            boardstring += fenSplit[0].charAt(fenstring);
        }
        else if ("12345678".includes(fenSplit[0].charAt(fenstring))) {
            for (var i=0 ; i<fenSplit[0].charAt(fenstring) ; i++) {
                boardstring += "e";
            }
        }
	}
    var side;
    if (fenSplit[1]==="w") {
        side = 1;
    }
    else {
        side = -1;
    }
    var rokade = fenSplit[2];
    var ep = fenSplit[3];
    var moveCount = fenSplit[5];
    var chessPosition = new Chess(fen);
    board = [boardstring,side,rokade,ep,moveCount,chessPosition];
	return board;
}
	
//Count the total nr of pieces on board
function PieceCount(board) {
	var count = 0;
	for ( var boardcounter=0; boardcounter<board[0].length ; boardcounter++ ) {
		if ( "kqrbnpKQRBNP".includes(board[0].charAt(boardcounter)) ) {
        	count++;
		}
    }
	return count;
}

//bepaal totaal waarde stukken op bord minus de koningen
function PieceValueCount(board) {
	var value = 0;
	for ( var boardcounter=0; boardcounter<board[0].length ; boardcounter++ ) {
		switch (board[0].charAt(boardcounter)) {

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
    var rowDistance = Math.abs(Math.floor(loc1/8)-Math.floor(loc2/8));
    var colDistance = Math.abs((loc1%8)-(loc2%8));
    var distance =  + rowDistance + colDistance;
    return distance;
}



function PlayBestMove(board) {
    var bestMove = "";
    var horizon = 3;
    posmoves = FindPossibleMoves(board);
    var bestValue = -99999;
    for (var i=0 ; i<posmoves.length ; i++ ) {
        var result = MakeMove(board,posmoves[i]);
        board = result[0];
        var score = NegaMax(board,horizon);
        board = UnMakeMove(board,result[1]);
        
        if (score > bestValue) {
            bestValue = score;
            
        }
    }
    return bestValue;
}


function NegaMax (board,depth) {
    if (depth===0) {       
        return NegaEval(board);
    }
    posmoves = FindPossibleMoves(board);
    var bestValue = -99999;
    for (var i=0 ; i<posmoves.length ; i++ ) {
        var result = MakeMove(board,posmoves[i]);
        board = result[0];
        var score = -NegaMax(board,depth-1);
        board = UnMakeMove(board,result[1]);
        
        if (score > bestValue) {
            bestValue = score;
        }
    }
    return bestValue;
}