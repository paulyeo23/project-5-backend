INSERT INTO tableplayers (roundid,
userid,
tableposition,
`check`,
folded,
stack) 
VALUES ((SELECT roundid FROM tableinfos WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 2),
0,
0,
0,
100),
((SELECT roundid FROM tableinfos WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 3),
1,
0,
0,
100);

SELECT * FROM DECKs;
SELECT * FROM playerhand;
SELECT * FROM tableinfos;
SELECT * FROM tableplayers;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users