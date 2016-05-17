
var tekst = $('#tekst');
var test1 = $('#test1');
var test2 = $('#test2');
var fen = "rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1"; // starting position fen
var fen = "8/2b3k1/8/4K3/8/2B5/8/8 w - - 0 1"; //testing position fen
var board = Fen2Board();

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
		if ( "kqrbnpKQRBNP".includes(board.charAt(boardcounter)) ) {
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
    var rowDistance = Math.abs(Math.floor(loc1/8)-Math.floor(loc2/8));
    var colDistance = Math.abs((loc1%8)-(loc2%8));
    var distance =  + rowDistance + colDistance;
    return distance;
}