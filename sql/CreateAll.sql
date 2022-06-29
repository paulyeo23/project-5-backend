INSERT INTO users(username,password,accountvalue) VALUES ('user1','password1',100),('user2','password2',100);
INSERT INTO Tables(name,maxPlayer,blinds,timeLimit,openclose) VALUES ("test",9,2,0,1);
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
INSERT INTO DECKS (roundid,deck,deckPosition) VALUES (
(SELECT roundid FROM Tableinfos WHERE roundid = 1),
"Kd7dQd4h6s7c3c2hKcTc9d9c3h6dTdQs8s4cQh7h3s5c8dTsQcAhTh4d8h9hKs3d5h6hJs5d8cJhJcAsJd2s2d6cAc2c9s7sAd5s4sKh",
0);
INSERT INTO tableplayers (roundid,
userid,
tableposition,
`check`,
folded,
stack) 
VALUES ((SELECT roundid FROM tableinfos WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 1),
0,
0,
0,
100),
((SELECT roundid FROM tableinfos WHERE roundid = 1),
(SELECT id FROM USERS WHERE id = 2),
1,
0,
0,
100);

INSERT INTO playerhands (handid,card) VALUES ((SELECT handid FROM tableplayers WHERE handid = 1),'As'),
((SELECT handid FROM tableplayers WHERE handid = 1),'Ac'),
((SELECT handid FROM tableplayers WHERE handid = 2),'Kd'),
((SELECT handid FROM tableplayers WHERE handid = 2),'Jd');

SELECT * FROM DECKs;
SELECT * FROM playerhands;
SELECT * FROM tableinfos;
SELECT * FROM tableplayers;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users;
SELECT * FROM CommunityCards
