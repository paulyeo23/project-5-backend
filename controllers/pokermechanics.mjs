import { request } from "https";
import { deck, shuffle } from "./deck.mjs";
import pkg from "pokersolver";
import { Server } from "socket.io";
import { WebSocketServer } from "ws";
const { Hand } = pkg;

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
      communityCards: await db.CommunityCards.findAll({
        where: { roundid: request.roundid },
      }),
      users: await db.Users.findAll(),
      hands: await db.PlayerHand.findAll(),
    };
    return info;
  };

  function deckToCard(info, deckPosition) {
    const deck = info.deck[0].deck;
    const card = `${deck[deckPosition * 2]}${deck[deckPosition * 2 + 1]}`;
    // console.log(deck);
    // console.log(position);
    return card;
  }

  function changePosition(info, position) {
    console.log(info);
    // console.log(position);
    //console.log(info);
    const maxSeat = info.table[0].maxPlayer;
    while (true) {
      position += 1;
      position = position % maxSeat;
      let nextPlayer = info.allPlayersInRound.filter((player) => {
        return player.tablePosition == position;
      })[0];
      if (nextPlayer != undefined) {
        console.log("nextplayer", nextPlayer.tablePosition, position);
        if (nextPlayer.folded == false || nextplayerIn == false) {
          break;
        }
      }
    }
    return position;
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

  async function roundEnd(info, request) {
    function addToPot() {
      let addToPot = info.tableInfo[0].pot;
      info.allPlayersInRound.forEach((player) => {
        addToPot += player.called;
      });
      //console.log("addToPot", addToPot);
      return addToPot;
    }
    //console.log("info.tableInfo.gameState", info.tableInfo[0].gameState);
    if (info.tableInfo[0].gameState == 3) {
      info.allPlayersInRound.forEach((player) => {
        info.tableInfo[0].pot += player.called;
      });
      payOut(info, showDown(info));
      info.tableInfo[0].roundid = info.tableInfo[0].nextGame;
      roundStart(info);
      Info(request.params).then((results) => {
        results.tableInfo[0].roundid = results.tableInfo[0].nextGame;
        respond.send(results);
      });
    } else if (info.tableInfo[0].gameState < 3) {
      //console.log("else");
      db.TableInfo.update(
        {
          // pot: function (){ const addToPot = 0
          //   info.allPlayersInRound.forEach(player =>{player.})}
          currentRaise: 0,
          previousRaise: 0,
          pot: addToPot(),
          gameState: info.tableInfo[0].gameState + 1,
          currentPosition: changePosition(
            info,
            info.tableInfo[0].dealerPosition,
          ),
        },
        {
          where: {
            roundid: request.roundid,
          },
        },
      );
      db.TablePlayer.update(
        { called: 0 },
        { where: { roundid: request.roundid } },
      );
      if (info.tableInfo[0].gameState == 0) {
        // console.log("dealCommunityCard");
        dealCommunityCard(info, request, 3);
      } else {
        await dealCommunityCard(info, request);
      }
      uncheckAll(info);
    }
  }

  function createNextGame(info) {
    db.TableInfo.create({
      tableid: info.table[0].id,
      currentRaise: 0,
      previousRaise: 0,
      gameState: 0,
      raisePosition: 0,
      dealerPosition: changePosition(info, info.tableInfo[0].dealerPosition),
      currentPosition: changePosition(info, info.tableInfo[0].dealerPosition),
    }).then(function (result) {
      const shuffledDeck = shuffle(10000).join("").toString();

      db.TableInfo.update(
        {
          nextGame: result.roundid,
        },
        { where: { roundid: info.tableInfo[0].roundid } },
      );
      db.Deck.create({
        roundid: result.roundid,
        deck: shuffledDeck,
        deckPosition: 0,
      });
      info.allPlayersInRound.forEach((player) => {
        // console.log("player", player);
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

  function createDeck(info, roundid) {
    const shuffledDeck = shuffle(10000).join("").toString();
    db.Deck.create({
      roundid: roundid,
      deck: shuffledDeck,
      deckPosition: 0,
    });
  }

  function roundStart(info) {
    function player(position) {
      return info.allPlayersInRound.filter((player) => {
        return player.tablePosition == position;
      })[0];
    }
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    for (let i = 0; i < 2; i++) {
      info.allPlayersInRound.forEach((x) => {
        const currentplayerid = player(
          info.tableInfo[0].currentPosition,
        ).userid;
        dealCard(info, currentplayerid, info.deck[0].deckPosition);
        info.deck[0].deckPosition += 1;
        info.tableInfo[0].currentPosition = changePosition(
          info,
          info.tableInfo[0].currentPosition,
        );
      });
    }
    db.Deck.update(
      {
        deckPosition: info.deck[0].deckPosition,
      },
      { where: { roundid: info.tableInfo[0].roundid } },
    );
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].dealerPosition,
    );

    console.log(
      "player(info.tableInfo[0].currentPosition).userid",
      player(info.tableInfo[0].currentPosition).userid,
    );
    raise(
      info,
      player(info.tableInfo[0].currentPosition).userid,
      info.table[0].blinds,
    );
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    console.log(
      "player(info.tableInfo[0].currentPosition).userid",
      info.tableInfo[0].currentPosition,
    );

    raise(
      info,
      player(info.tableInfo[0].currentPosition).userid,
      info.table[0].blinds * 2,
    );
    info.tableInfo[0].currentPosition = changePosition(
      info,
      info.tableInfo[0].currentPosition,
    );
    createNextGame(info);

    db.TableInfo.update(
      {
        currentPosition: info.tableInfo[0].currentPosition,
        currentRaise: info.table[0].blinds * 2,
        previousRaise: info.table[0].blinds,
      },
      { where: { roundid: info.tableInfo[0].roundid } },
    );
  }

  function nextGameInfo(info) {
    info.tableInfo[0].roundid = info.tableInfo[0].nextGame;
  }

  function seatPlayer(info, request) {
    if (info.allPlayersInRound.length == 0) {
      db.TablePlayer.create({
        roundid: request.params.roundid,
        userid: request.params.userid,
        tablePosition: 0,
        stack: 100,
      }).then((results) => {
        Info(request.params).then((results) => {
          response.send(results);
        });
      });
    } else if (info.allPlayersInRound.length > 0)
      for (let i = 0; i < info.table.maxPlayer; i++) {
        const tablePosition = i;
        const playerInPosition = info.allPlayersInRound.filter((player) => {
          return player == tablePosition;
        });
        if (playerInPosition.length == 0) {
          db.TablePlayer.create({
            roundid: request.params.roundid,
            userid: request.params.userid,
            tablePosition: tableposition,
            stack: 100,
          });
          if (info.allPlayersInRound.length + 1 >= 2) {
            Info(request.params).then((results) => {
              response.send(results);
            });
            break;
          }
        }
      }
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

  function uncheckAll(info) {
    db.TablePlayer.update(
      { check: false },
      { where: { roundid: info.tableInfo[0].roundid, allIn: false } },
    );
  }

  function raise(info, userid, raisevalue) {
    console.log("userid", userid);
    const currentPlayer = info.allPlayersInRound.filter((player) => {
      return player.userid == userid;
    })[0];
    uncheckAll(info);
    db.TablePlayer.update(
      {
        check: true,
        called: raisevalue,
        stack: currentPlayer.stack - raisevalue,
      },

      { where: { roundid: info.tableInfo[0].roundid, userid: userid } },
    );
    db.TableInfo.update(
      {
        raisePosition: currentPlayer.tablePosition,
        currentRaise: request.raisevalue,
        previousRaise: info.tableInfo[0].currentRaise,
      },
      {
        where: { roundid: info.tableInfo[0].roundid },
      },
    );
  }

  function payOut(info, winneridList) {
    winneridList.forEach((winnerid) => {
      const currentPlayer = info.allPlayersInRound.filter((player) => {
        return player.userid == winnerid;
      })[0];
      db.TablePlayer.update(
        {
          stack:
            currentPlayer.stack + info.tableInfo[0].pot / winneridList.length,
        },
        {
          where: {
            userid: currentPlayer.userid,
            roundid: info.tableInfo[0].nextGame,
          },
        },
      );
      // console.log("payout stack", currentPlayer.stack, info.tableInfo[0].pot);
    });
  }

  function showDown(info) {
    const showdownPlayers = info.allPlayersInRound.filter((player) => {
      return player.folded == false;
    });
    const hands = [];
    const Hands = [];
    const userids = [];
    const communityCards = (function () {
      const cards = [];
      info.communityCards.forEach((card) => {
        cards.push(card.card);
      });
      return cards;
    })();
    showdownPlayers.forEach((player) => {
      const handList = [];
      const hand = info.hands.filter((hand) => {
        return hand.handid == player.handid;
      });

      hand.forEach((card) => {
        handList.push(card.card);
      });

      hands.push({
        userid: player.userid,
        hand: Hand.solve(handList.concat(communityCards)),
      });
    });
    hands.forEach((hand) => {
      Hands.push(hand.hand);
    });

    const winners = Hand.winners(Hands);

    winners.forEach((winner) => {
      const hand = hands.filter((hand) => {
        return hand.hand == winner;
      })[0];

      userids.push(hand.userid);
    });
    // console.log("userids", userids);
    return userids;
  }

  function dealCard(info, userid, deckPosition) {
    const handid = info.allPlayersInRound.filter((player) => {
      return player.userid == userid;
    })[0];
    console.log("handid", handid.handid);

    db.PlayerHand.create(
      {
        handid: handid.handid,
        card: deckToCard(info, deckPosition),
      },
      { where: { id: userid } },
    );
  }

  function dealCommunityCard(info, request, repeats = 1) {
    //console.log("info.tableInfo[0].roundid", info.tableInfo[0].roundid);
    for (let i = 1; i < repeats + 1; i++) {
      db.CommunityCards.create({
        roundid: info.tableInfo[0].roundid,
        card: deckToCard(info, info.deck[0].deckPosition + i),
      });
    }
    db.Deck.update(
      { deckPosition: info.deck[0].deckPosition + repeats + 1 },
      { where: { roundid: request.roundid } },
    );
  }

  const checkplayer = async (request, response) => {
    try {
      //console.log(request.params);

      Info(request.params).then(function (info) {
        const currentPlayer = info.allPlayersInRound.filter((player) => {
          return player.userid == request.params.userid;
        })[0];

        if (
          currentPlayer.tablePosition != info.tableInfo[0].currentPosition ||
          currentPlayer.called < info.tableInfo[0].currentRaise
        ) {
          //console.log("False");

          return false;
        }
        currentPlayer.check = true;
        // console.log(info.allPlayersInRound);

        db.TablePlayer.update(
          { check: true },
          {
            where: {
              roundid: request.params.roundid,
              userid: request.params.userid,
            },
          },
        );
        // console.log(checkRoundEnd(info) == true);
        if (checkRoundEnd(info) == true) {
          roundEnd(info, request.params);
          Info(request.params).then((result) => {
            response.send(result);
          });
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
            // console.log("respond");
            Info(request.params).then((result) => {
              response.send(result);
            });
          });
        }
      });

      //socket emit
    } catch (error) {
      //console.log(error);
    }
  };

  const raiseplayer = async (request, response) => {
    try {
      //console.log(request.params);
      Info(request.params).then(function (results) {
        const info = results;
        const currentPlayer = info.allPlayersInRound.filter((player) => {
          return player.userid == request.params.userid;
        })[0];

        if (currentPlayer.tablePosition != info.tableInfo[0].currentPosition) {
          //console.log("false");
          return false;
        }
        raise(info, request.params.userid, request.params.raisevalue);
        db.TableInfo.update(
          {
            currentPosition: changePosition(info, currentPlayer.tablePosition),
          },
          {
            where: {
              roundid: request.params.roundid,
              tableid: request.params.tableid,
            },
          },
        );
        db.TablePlayer.update(
          {
            check: true,
          },
          {
            where: {
              roundid: request.params.roundid,
              userid: request.params.userid,
            },
          },
        ).then((results) => {
          // console.log("respond");
          Info(request.params).then((result) => {
            response.send(result);
            socket.emit("message", (data) => {
              const packet = JSON.parse(data);

              switch (packet.type) {
                case "gameState":
                  result;
                  break;
              }
            });
          });
        });
      });
    } catch (error) {
      //console.log(error);
    }
  };

  const foldplayer = async (request, response) => {
    try {
      Info(request.params)
        .then(function (results) {
          const info = results;
          const currentPlayer = allPlayersInRound.filter((player) => {
            return player.userid == request.params.userid;
          })[0];

          if (
            currentPlayer.tablePosition != info.tableInfo[0].currentPosition
          ) {
            return;
          }
          fold(request.params);
          if (checkAllFolded(info) == true) {
            roundEnd(info, request.params).then((result) => {
              payOut(info, showDown(info));
              results.tableInfo[0].roundid = results.tableInfo[0].nextGame;
              roundStart(info);
              Info(request.params).then((results) => {
                results.tableInfo[0].roundid = results.tableInfo[0].nextGame;
                respond.send(results);
              });
            });
          }
          if (checkRoundEnd(info) == true) {
            roundEnd(info, request.params);
          }
        })
        .then((results) => {
          // console.log("respond");
          Info(request.params).then((result) => {
            response.send(result);
          });
        });
    } catch (error) {
      //console.log(error);
    }
  };

  const callplayer = async (request, response) => {
    try {
      Info(request.params).then(function (results) {
        const info = results;
        const currentPlayer = info.allPlayersInRound.filter((player) => {
          return player.userid == request.params.userid;
        })[0];

        if (currentPlayer.tablePosition != info.tableInfo[0].currentPosition) {
          return false;
        }

        if (currentPlayer.stack > info.tableInfo[0].currentRaise) {
          currentPlayer.check = true;
          currentPlayer.called = info.tableInfo[0].currentRaise;
          db.TablePlayer.update(
            {
              check: true,
              called: info.tableInfo[0].currentRaise,
              stack: currentPlayer.stack - info.tableInfo[0].currentRaise,
            },
            {
              where: {
                roundid: request.params.roundid,
                userid: request.params.userid,
              },
            },
          );
        } else if (currentPlayer.stack <= info.tableInfo[0].currentRaise) {
          currentPlayer.check = true;
          currentPlayer.allIn = true;
          currentPlayer.called = currentPlayer.called + currentPlayer.stack;
          db.TablePlayer.update(
            {
              check: true,
              called: currentPlayer.called + currentPlayer.stack,
              stack: 0,
              allIn: true,
            },
            {
              where: {
                roundid: request.params.roundid,
                userid: request.params.userid,
              },
            },
          );
        }

        if (checkRoundEnd(info) == true) {
          roundEnd(info, request.params);
          Info(request.params).then((result) => {
            response.send(result);
          });
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
            // console.log("respond");
            Info(request.params).then((result) => {
              response.send(result);
            });
          });
        }
      });
    } catch (error) {
      //console.log(error);
    }
  };

  const sitPlayer = async (request, response) => {
    try {
      Info(request.params).then((info) => {
        console.log(info);
        if (info.allPlayersInRound.length == 0) {
          db.TablePlayer.create({
            roundid: info.tableInfo[0].roundid,
            userid: request.params.userid,
            tablePosition: 0,
            stack: 100,
          }).then((results) => {
            Info(request.params).then((results) => {
              response.send(results);
            });
          });
        } else if (info.allPlayersInRound.length > 0) {
          for (let i = 0; i < info.table[0].maxPlayer; i++) {
            const tablePosition = i;
            const playerInPosition = info.allPlayersInRound.filter((player) => {
              return player.tablePosition == tablePosition;
            });
            if (playerInPosition.length == 0) {
              db.TablePlayer.create({
                roundid: info.tableInfo[0].roundid,
                userid: request.params.userid,
                tablePosition: tablePosition,
                stack: 100,
              }).then((results) => {
                if (info.allPlayersInRound.length + 1 >= 2) {
                  console.log("roundstart");
                  Info(request.params).then((results) => {
                    roundStart(results);
                    Info(request.params).then((result) => {
                      response.send(result);
                    });
                  });
                }
              });
              return;
            }
          }
        }
      });
    } catch (error) {
      //console.log(error);
    }
  };

  const index = async (request, response) => {
    try {
      Info(request.params).then((result) => {
        roundStart(result);
        response.send(result);
      });
    } catch (error) {
      //console.log(error);
    }
  };

  return {
    index,
    checkplayer,
    foldplayer,
    raiseplayer,
    callplayer,
    sitPlayer,
  };
}
