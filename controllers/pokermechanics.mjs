import { request } from "https";
import {} from "pokersolver";

export default function initPokerMechanicsController(db) {
  const Info = async (request) => {
    const info = {
      table: await db.Tables.findAll({
        where: { id: request.tableid },
      }),
      tableInfo: await db.TableInfo.findAll({
        where: { roundid: request.roundid },
      }),
      roundId: request.roundid,
      allPlayersInRound: await db.TablePlayer.findAll({
        where: { roundid: request.roundid },
      }),
      deck: await db.Deck.findAll({
        where: { roundid: request.roundid },
      }),
      users: await db.Users.findAll(),
    };
    return info;
  };

  function deckToCard(deck, position) {
    const card = `${deck[position - 1]}${deck[position]}`;
    return card;
  }

  function changePosition(info, position) {
    console.log(position);
    const maxSeat = info.table[0].maxPlayer;
    while (true) {
      position += 1;
      let newPosition = position % maxSeat;
      let nextPlayer = info.allPlayersInRound.filter((player) => {
        return player.tablePosition == newPosition;
      })[0];
      if (nextPlayer != undefined) {
        if (nextPlayer.folded == false || nextplayer.allIn == false) {
          return newPosition;
        }
      }
    }
  }

  function checkRoundEnd(info) {
    for (let i = 0; i < info.allPlayersInRound.length; i++) {
      const player = info.allPlayersInRound[i];
      if (
        player.check == true ||
        player.folded == true ||
        player.allIn == true
      ) {
      } else {
        return false;
      }
    }
    return true;
  }

  function roundEnd(info, request) {
    db.TableInfo.update(
      {
        currentRaise: 0,
        previousRaise: 0,
        gameState: info.tableInfo[0].gameState + 1,
        currentPosition: changePosition(info, info.tableInfo[0].dealerPosition),
      },
      {
        where: {
          roundid: request.roundid,
          tableid: request.tableid,
        },
      },
    );
    db.TablePlayer.update(
      { check: false },
      { where: { roundid: request.roundid } },
    );
  }

  function createNextGame(info, request) {
    db.TableInfo.create({
      tableid: info.table[0].id,
      currentRaise: 0,
      previousRaise: 0,
      gameState: 0,
      raisePosition: 0,
      dealerPosition: changePosition(info, info.tableInfo[0].dealerPosition),
      currentPosition: changePosition(info, info.tableInfo[0].dealerPosition),
    }).then(function (result) {
      db.TableInfo.update(
        {
          nextGame: result.roundid,
        },
        { where: { roundid: request.roundid } },
      );
      info.allPlayersInRound.forEach((player) => {
        console.log("player", player);
        db.TablePlayer.create({
          roundid: result.roundid,
          userid: info.users.filter((user) => {
            return user.id == player.userid;
          })[0].id,
          tablePosition: player.tablePosition,
        });
      });
    });
  }

  function shiftToNextGame(info, request) {}

  function seatPlayer(request){
    db.TablePlayer.create({})
  }

  function unseatPlayer(request) {
    db.TablePlayer.deleteAll({
      where: { roundid: request.roundid, userid: request.userid },
    });
  }

  function checkAllFolded(info, request) {
    const Folded = info.allPlayersInRound.filter((player) => {
      return player.folded == true;
    });
    if (Folded.length == info.allPlayersInRound - 1) {
      return true;
    } else {
      return false;
    }
  }

  function fold(request) {
    db.TablePlayer.update(
      { folded: true },
      { where: { roundid: request.roundid, userid: request.userid } },
    );
  }

  function allin(request) {
    db.TablePlayer.update(
      { allIn: true },
      { where: { roundid: request.roundid, userid: request.userid } },
    );
  }

  function uncheckAll(request) {
    db.TablePlayer.update(
      { check: false },
      { where: { roundid: request.roundid, allIn: false } },
    );
  }

  function raise(info, request) {
    db.TablePlayer.update(
      { check: true, raise: request.raise },
      { where: { roundid: request.roundid, userid: request.userid } },
    );
    db.TableInfo.update(
      {
        currentRaise: request.raise,
        previousRaise: info.tableInfo.currentRaise,
      },
      {
        where: { roundid: request.roundid },
      },
    );
    uncheckAll(request);
  }

  function payOut(info) {}

  function dealCardToPlayer(info, request) {
    const currentplayer = info.allPlayersInRound

      .filter((player) => {
        return player.userid == request.userid;
      })
      .filter((player) => {
        return player.roundid == roundid;
      });

    const handid = currentplayer[0].handid;

    const unusedHand = db.PlayerHand.findAll({
      where: { handid: handid, card: 0 },
    })[0];
    db.PlayerHand.update(
      {
        card: deckToCard(info.deck.deck, info.deck.position),
      },
      { where: { id: unusedHand.id } },
    );
    db.Deck.update(
      { position: info.deck.position + 1 },
      { where: { roundid: request.roundid } },
    );
  }

  const checkplayer = async (request, response) => {
    try {
      console.log(request.params);
      const info = [Info(request.params)];

      Promise.all(info).then(function (results) {
        const info = results[0];

        const currentPlayer = info.allPlayersInRound.filter((player) => {
          return player.userid == request.params.userid;
        })[0];

        if (currentPlayer.tablePosition != info.tableInfo[0].currentPosition) {
          console.log("False");

          return;
        }

        db.TablePlayer.update(
          { check: true },
          {
            where: {
              roundId: request.params.roundid,
              userId: request.params.userid,
            },
          },
        );
        if (checkRoundEnd(info) == true) {
          console.log("info.tableInfo.gameState", info.tableInfo[0].gameState);
          db.TableInfo.update(
            {
              currentRaise: 0,
              previousRaise: 0,
              gameState: info.tableInfo[0].gameState + 1,
              currentPosition: changePosition(
                info,
                info.tableInfo[0].dealerPosition,
              ),
            },
            {
              where: {
                roundid: request.params.roundid,
                tableid: request.params.tableid,
              },
            },
          ).then((results) => {
            console.log("respond");
            Info(request.params).then((result) => {
              response.send(result);
            });
          });
          uncheckAll(request.params);
        } else {
          db.TableInfo.update(
            {
              currentPosition: changePosition(
                info,
                currentPlayer.tablePosition,
              ),
            },
            {
              where: {
                roundid: request.params.roundid,
                tableid: request.params.tableid,
              },
            },
          ).then((results) => {
            console.log("respond");
            Info(request.params).then((result) => {
              response.send(result);
            });
          });
        }
      });

      //socket emit
    } catch (error) {
      console.log(error);
    }
  };

  const raiseplayer = async (request, response) => {
    try {
      const info = [Info()];
      Promise.all(info).then(function (results) {
        const info = results[0];
        raise(info, request.params);
      });
      response.send({ tableInfo });
    } catch (error) {
      console.log(error);
    }
  };

  const index = async (request, response) => {
    try {
      const tableInfo = await db.TableInfo.findAll();
      response.send({ tableInfo });
    } catch (error) {
      console.log(error);
    }
  };

  return {
    index,
    checkplayer,
  };
}
