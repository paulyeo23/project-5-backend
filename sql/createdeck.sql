INSERT INTO DECKS (roundid,deck,deckPosition) VALUES (
(SELECT roundid FROM Tableinfos WHERE roundid = 1),
"Kd7dQd4h6s7c3c2hKcTc9d9c3h6dTdQs8s4cQh7h3s5c8dTsQcAhTh4d8h9hKs3d5h6hJs5d8cJhJcAsJd2s2d6cAc2c9s7sAd5s4sKh",
0);

SELECT * FROM DECKs;
SELECT * FROM playerhand;
SELECT * FROM tableinfos;
SELECT * FROM tableplayers;
SELECT * FROM tables;
SELECT * FROM transactions;
SELECT * FROM Users;

