INSERT INTO tableinfo (tableid,
dealerPosition,
raisePosition,
currentPosition,
currentraise,
previousraise,
gamestate) VALUES 
((SELECT id FROM TABLES WHERE id = 1),
0,
0,
0,
0,
0,
0);

SELECT * FROM DECK;
SELECT * FROM playerhand;
SELECT * FROM tableinfo;
SELECT * FROM tableplayer;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users