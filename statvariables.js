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
var ActiveRookParameter     = 2;
var ActiveQueenParameter	= 2;
var ActiveAttackParameter 	= 1; // value if blocked by enemy piece is looking at enemy piece

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

var bishopDirection = [-7,-9,7,9];
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

var rookDirection = [1,-8,-1,8];

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
-30,-40,-40,-45,-45,-40,-40,-30,
-30,-40,-40,-45,-45,-40,-40,-30,
-30,-40,-40,-45,-45,-40,-40,-30,
-30,-35,-40,-45,-45,-40,-35,-30,
-20,-30,-30,-40,-40,-30,-30,-20,
-10,-20,-20,-20,-20,-20,-20,-10,
 20, 20,  0,  0,  0,  0, 20, 20,
 20, 30, 10,  0,  0, 10, 30, 20
];

var kingendtable = [
-40,-35,-30,-20,-20,-30,-35,-40,
-30,-20,-10,  0,  0,-10,-20,-30,
-30,-10, 20, 30, 30, 20,-10,-30,
-25,-10, 30, 35, 35, 30,-10,-25,
-25,-10, 30, 35, 35, 30,-10,-25,
-30,-10, 20, 30, 30, 20,-10,-30,
-30,-30,  0,  0,  0,  0,-30,-30,
-40,-30,-30,-30,-30,-30,-30,-40
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
                     
var isolatedPawnValue = 5;
var doubledPawnValue = 4;