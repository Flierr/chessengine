
// evaluate a score for a given position. A positive score indicates white is ahead.
function Eval (board) {
	
	var score 	= MaterialParameter     * MaterialScore(board)
                + ActivityParameter		* ActivityScore(board)
                + PieceSquareParameter	* PieceSquareScore(board)
                + KingSafetyParamter    * KingSafetyScore(board);
                + PawnStructureParameter* PawnStructureScore(board);

	return score;	
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
			case "k": 
                var gamePhase = ( PieceValueCount(board) / staticpiecevalue );
                score -= gamePhase * kingtable[63-boardcounter] + (1-gamePhase) * kingendtable[63-boardcounter]; 		
                break;
			case "q": score -= queentable[63-boardcounter];		break;
			case "r": score -= rooktable[63-boardcounter]; 		break;
			case "b": score -= bishoptable[63-boardcounter]; 	break;
			case "n": score -= knighttable[63-boardcounter]; 	break;
			case "p": score -= pawntable[63-boardcounter]; 		break;
			case "K": 
                var gamePhase = ( PieceValueCount(board) / staticpiecevalue );
                score += gamePhase * kingtable[boardcounter] + (1-gamePhase) * kingendtable[boardcounter]; 		
                break;
			case "Q": score += queentable[boardcounter]; 		break;
			case "R": score += rooktable[boardcounter];			break;
			case "B": score += bishoptable[boardcounter];		break;
			case "N": score += knighttable[boardcounter];		break;
			case "P": score += pawntable[boardcounter]; 		break;
		}
	}
	return score;
}

//add or substract score for a safe king.
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
	
	//factor 2: Pawnshield in front and around king
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

// add or substract score for a good pawn structure
function PawnStructureScore (board) {
    var score = 0;
    
    return score;
}


// evaluate a score for the mobility of pieces: knight bishop rook and queen
// add or substract score for each empty square, small bonus if blocked by enemy piece
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

                        if (board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) { 
                            score += ActiveBishopParameter;
                        }
                        else if ( "rnbqkp".includes( board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            score += ActiveAttackParameter;
                            block = true;
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

                        if (board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) { 
                            score -= ActiveBishopParameter;
                        }
                        else if ( "RNBQKP".includes( board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            score -= ActiveAttackParameter;
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
						if (board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) === "e" ) { 
                           score += ActiveRookParameter;
                        }
                        else if ( "rnbqkp".includes( board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) ) ) {
                            score += ActiveAttackParameter;
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
						if (board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) === "e" ) { 
                            score -= ActiveRookParameter;
                        }
                        else if ( "RNBQKP".includes( board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) ) ) {
                            score -= ActiveAttackParameter;
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
				var queensquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				//horizontal and vertical queenlines
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<queensquares[i] && !block) {
						if (board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) === "e" ) { 
                           score += ActiveQueenParameter;
                        }
                        else if ( "rnbqkp".includes( board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) ) ) {
                            score += ActiveAttackParameter;
                            block = true;
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

                        if (board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) { 
                            score += ActiveQueenParameter;
                        }
                        else if ( "rnbqkp".includes( board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            score += ActiveAttackParameter;
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
				var queensquares = [7-(boardcounter%8),Math.floor(boardcounter/8),boardcounter%8,7-Math.floor(boardcounter/8)];
				//horizontal and vertical queenlines
				for (var i=0 ; i<4 ; i++) {
					var j=0;
					var block = false;
					while ( j<queensquares[i] && !block) {
						if (board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) === "e" ) { 
                            score -= ActiveQueenParameter;
                        }
                        else if ( "RNBQKP".includes( board.charAt( boardcounter+(rookDirection[i]*(j+1)) ) ) ) {
                            score -= ActiveAttackParameter;
                            block = true;
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

                        if (board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) === "e" ) { 
                            score -= ActiveQueenParameter;
                        }
                        else if ( "RNBQKP".includes( board.charAt( boardcounter+(bishopDirection[i]*(j+1)) ) ) ) {
                            score -= ActiveAttackParameter;
                            block = true;
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