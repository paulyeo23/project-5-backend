INSERT INTO tableinfos (tableid,
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

SELECT * FROM DECKs;
SELECT * FROM playerhand;
SELECT * FROM tableinfos;
SELECT * FROM tableplayers;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users