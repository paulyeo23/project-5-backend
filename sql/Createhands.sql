INSERT INTO tableplayer (roundid,
userid,
tableposition,
`check`,
folded,
stack) 
VALUES ((SELECT roundid FROM tableinfo WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 1),
0,
0,
0,
100),
((SELECT roundid FROM tableinfo WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 2),
1,
0,
0,
100);

SELECT * FROM DECK;
SELECT * FROM playerhand;
SELECT * FROM tableinfo;
SELECT * FROM tableplayer;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users